
'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { initializeFirebase } from '@/firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber as firebaseSignInWithPhoneNumber,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged,
  type ConfirmationResult, 
  type User as FirebaseUser,
  type AuthError
} from 'firebase/auth';

const { auth } = initializeFirebase();

interface AuthContextType {
  user: (FirebaseUser & { isAdmin?: boolean }) | null;
  isAuthenticated: boolean;
  loading: boolean;
  confirmationResult: ConfirmationResult | null;
  signInWithPhoneNumber: (phoneNumber: string) => Promise<void>;
  signInWithEmailAndPassword: (email: string, pass: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

const ADMIN_EMAIL = 'admin@swiftshop.com';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
            const augmentedUser: AuthContextType['user'] = {
                ...fbUser,
                isAdmin: fbUser.email === ADMIN_EMAIL
            };
            setUser(augmentedUser);
        } else {
            // If no user, sign in anonymously for guest carts etc.
            signInAnonymously(auth).catch(error => {
                console.error("Anonymous sign in failed:", error);
            });
            setUser(null);
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);


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
  };

  const signInWithPhoneNumber = async (phoneNumber: string): Promise<void> => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      const result = await firebaseSignInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      window.confirmationResult = result;
    } catch (error) {
      console.error("Error during signInWithPhoneNumber", error);
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
      throw error;
    }
  };

  const signInWithEmailAndPassword = async (email: string, pass: string): Promise<void> => {
    try {
      await firebaseSignInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
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
  };

  const verifyOtp = async (otp: string): Promise<void> => {
    const confirmation = confirmationResult || window.confirmationResult;
    if (!confirmation) {
      throw new Error("No confirmation result available. Please send OTP first.");
    }
  
    await confirmation.confirm(otp);
    
    setConfirmationResult(null);
    if(window.confirmationResult) {
      window.confirmationResult = undefined;
    }
  };

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !user.isAnonymous,
        loading,
        confirmationResult,
        signInWithPhoneNumber,
        signInWithEmailAndPassword,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
