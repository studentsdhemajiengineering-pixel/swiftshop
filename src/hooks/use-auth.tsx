
'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  onAuthStateChanged,
  type ConfirmationResult, 
  type User as FirebaseUser 
} from 'firebase/auth';

interface AuthContextType {
  user: (FirebaseUser | { isDemo: boolean, phoneNumber: string, displayName: string, uid: string }) | null;
  isAuthenticated: boolean;
  loading: boolean;
  confirmationResult: ConfirmationResult | null;
  signInWithPhoneNumber: (phoneNumber: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// It's important to have a window.recaptchaVerifier instance for Firebase Phone Auth.
// We declare it here to be accessible within the component.
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

const DEMO_PHONE_NUMBER = '+919876543210';
const DEMO_OTP = '123456';
let isDemoMode = false;


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setupRecaptcha = () => {
    // Check if the verifier is already initialized to avoid re-rendering.
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("reCAPTCHA solved");
        },
        'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
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
        return; // Bypass Firebase for demo user
    }
    isDemoMode = false;
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      window.confirmationResult = result; // Store it on window if needed
    } catch (error) {
      console.error("Error during signInWithPhoneNumber", error);
      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
      throw error;
    }
  };

  const verifyOtp = async (otp: string): Promise<void> => {
    if (isDemoMode) {
        if (otp === DEMO_OTP) {
             setUser({
                isDemo: true,
                phoneNumber: DEMO_PHONE_NUMBER,
                displayName: 'Demo User',
                uid: 'demo-user-uid',
            });
            return;
        }
        throw new Error('Invalid demo OTP');
    }

    if (!confirmationResult) {
      throw new Error("No confirmation result available. Please send OTP first.");
    }
    await confirmationResult.confirm(otp);
    // User is now signed in. The onAuthStateChanged listener will update the user state.
    setConfirmationResult(null); // Clear confirmation result
  };

  const logout = async () => {
    if (isDemoMode) {
        setUser(null);
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
