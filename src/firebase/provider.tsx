
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, getDoc, setDoc } from 'firebase/firestore';
import {
    Auth,
    User,
    onAuthStateChanged,
    RecaptchaVerifier,
    signInWithPhoneNumber as firebaseSignInWithPhoneNumber,
    createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
    signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
    signInAnonymously,
    signOut,
    type ConfirmationResult
} from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/firebase/firebase-error-listener';

// This needs to be in the global scope for the reCAPTCHA to work.
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

const ADMIN_EMAIL = 'admin@swiftshop.com';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

// User object augmented with isAdmin flag
type AppUser = User & { isAdmin?: boolean };

// Internal state for user authentication
interface UserAuthState {
  user: AppUser | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState extends UserAuthState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  // Auth methods
  signInWithPhoneNumber: (phoneNumber: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  signInWithEmailAndPassword: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true,
    userError: null,
  });
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    const handleUserCreation = async (fbUser: User) => {
        const userDocRef = doc(firestore, 'users', fbUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            const newUser = {
                id: fbUser.uid,
                email: fbUser.email,
                phone: fbUser.phoneNumber,
                firstName: fbUser.displayName?.split(' ')[0] || '',
                lastName: fbUser.displayName?.split(' ')[1] || '',
            };
            await setDoc(userDocRef, newUser);
        }
    };

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Create user document if it doesn't exist
        await handleUserCreation(fbUser);

        const augmentedUser: AppUser = {
          ...fbUser,
          uid: fbUser.uid,
          isAdmin: fbUser.email === ADMIN_EMAIL,
        };
        setUserAuthState({ user: augmentedUser, isUserLoading: false, userError: null });
      } else {
        // If not logged in, try to sign in anonymously
        signInAnonymously(auth).catch(error => {
          console.error("Anonymous sign in failed:", error);
           setUserAuthState({ user: null, isUserLoading: false, userError: error });
        });
      }
    }, (error) => {
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const setupRecaptcha = () => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => console.log("reCAPTCHA solved"),
        'expired-callback': () => {
            console.log("reCAPTCHA expired");
            if (window.recaptchaVerifier) {
              window.recaptchaVerifier.clear();
            }
        }
      });
    }
    return window.recaptchaVerifier;
  };

  const methods = useMemo(() => ({
    signInWithPhoneNumber: async (phoneNumber: string): Promise<void> => {
        const appVerifier = setupRecaptcha();
        try {
            const result = await firebaseSignInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(result);
            window.confirmationResult = result; // Also store on window for resilience
        } catch (error) {
            console.error("Error during signInWithPhoneNumber", error);
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
            }
            throw error;
        }
    },
    verifyOtp: async (otp: string): Promise<void> => {
        const confirmation = confirmationResult || window.confirmationResult;
        if (!confirmation) {
            throw new Error("No confirmation result available. Please send OTP first.");
        }
        await confirmation.confirm(otp);
        setConfirmationResult(null);
        if (window.confirmationResult) {
            window.confirmationResult = undefined;
        }
    },
    signInWithEmailAndPassword: async (email: string, pass: string): Promise<void> => {
        try {
            await firebaseSignInWithEmailAndPassword(auth, email, pass);
        } catch (error: any) {
            // If the admin user doesn't exist, create it.
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                if (email === ADMIN_EMAIL) {
                    try {
                        await firebaseCreateUserWithEmailAndPassword(auth, email, pass);
                    } catch (creationError) {
                        console.error("Failed to create admin user:", creationError);
                        throw creationError;
                    }
                } else {
                    throw error;
                }
            } else {
                throw error;
            }
        }
    },
    logout: async () => {
        await signOut(auth);
    }
  }), [auth, confirmationResult]);

  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      ...userAuthState,
      ...methods,
    };
  }, [firebaseApp, firestore, auth, userAuthState, methods]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

// Simplified hooks
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  if (!auth) throw new Error("Auth service not available");
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  if (!firestore) throw new Error("Firestore service not available");
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  if (!firebaseApp) throw new Error("Firebase App not available");
  return firebaseApp;
};

export type UserHookResult = {
  user: AppUser | null;
  isUserLoading: boolean;
  userError: Error | null;
};
export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError } = useFirebase();
  return { user, isUserLoading, userError };
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

    