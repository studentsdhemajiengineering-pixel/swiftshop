
'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { initializeFirebase } from '@/firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  onAuthStateChanged,
  type ConfirmationResult, 
  type User as FirebaseUser 
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

const DEMO_PHONE_NUMBER = '+919876543210';
const DEMO_OTP = '123456';
const DEMO_USER_STORAGE_KEY = 'swiftshop-demo-user';
let isDemoMode = false;

const ADMIN_EMAIL = 'admin@swiftshop.com';
const ADMIN_PASSWORD = 'password'; // In a real app, use Firebase Auth

const setDemoUser = (user: AuthContextType['user']) => {
    if (typeof window !== 'undefined') {
        if (user) {
            window.localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(user));
        } else {
            window.localStorage.removeItem(DEMO_USER_STORAGE_KEY);
        }
    }
}

const getDemoUser = (): AuthContextType['user'] | null => {
     if (typeof window !== 'undefined') {
        const storedUser = window.localStorage.getItem(DEMO_USER_STORAGE_KEY);
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                return { ...parsedUser, isAdmin: parsedUser.email === ADMIN_EMAIL };
            } catch (e) {
                console.error("Failed to parse demo user from localStorage", e);
                return null;
            }
        }
    }
    return null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
            const augmentedUser: AuthContextType['user'] = { ...fbUser, isAdmin: fbUser.email === ADMIN_EMAIL };
            setUser(augmentedUser);
        } else {
            // Check for demo user if no firebase user
            const demoUser = getDemoUser();
            if (demoUser) {
                setUser(demoUser);
                isDemoMode = true;
            } else {
                setUser(null);
            }
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
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

  const signIn = async (phoneNumber: string): Promise<void> => {
     if (phoneNumber === DEMO_PHONE_NUMBER) {
        isDemoMode = true;
        return;
    }
    isDemoMode = false;
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
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
    if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
        isDemoMode = true;
        const adminUser: AuthContextType['user'] = {
            email: ADMIN_EMAIL,
            displayName: 'Admin User',
            uid: 'admin-user-uid',
            isAdmin: true,
        } as AuthContextType['user'];
        setUser(adminUser);
        setDemoUser(adminUser);
        return;
    }
    await firebaseSignInWithEmailAndPassword(auth, email, pass);
  };

  const verifyOtp = async (otp: string): Promise<void> => {
    if (isDemoMode) {
        if (otp === DEMO_OTP) {
            const demoUser: any = {
                isDemo: true,
                phoneNumber: DEMO_PHONE_NUMBER,
                displayName: 'Demo User',
                uid: 'demo-user-uid',
            };
             setUser(demoUser);
             setDemoUser(demoUser);
            return;
        }
        throw new Error('Invalid demo OTP');
    }

    if (!confirmationResult) {
      throw new Error("No confirmation result available. Please send OTP first.");
    }
    await confirmationResult.confirm(otp);
    setConfirmationResult(null);
  };

  const logout = async () => {
    if (isDemoMode) {
        setUser(null);
        setDemoUser(null);
        isDemoMode = false;
        return;
    }
    await auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        confirmationResult,
        signInWithPhoneNumber: signIn,
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
