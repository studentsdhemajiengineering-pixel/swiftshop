
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
const DEMO_USER_STORAGE_KEY = 'swiftshop-demo-user';
let isDemoMode = false;

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
                return JSON.parse(storedUser);
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
    const demoUser = getDemoUser();
    if (demoUser) {
        setUser(demoUser);
        isDemoMode = true;
        setLoading(false);
    } else {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setLoading(false);
        });
        return () => unsubscribe();
    }
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
            const demoUser = {
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
    // User is now signed in. The onAuthStateChanged listener will update the user state.
    setConfirmationResult(null); // Clear confirmation result
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
