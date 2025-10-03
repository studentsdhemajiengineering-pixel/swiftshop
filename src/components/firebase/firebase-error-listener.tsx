
'use client';

import { useEffect } from 'react';
import { errorEmitter } from './error-emitter';
import type { FirestorePermissionError } from './errors';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // In a Next.js development environment, throwing an error here will
      // display the error overlay, which is great for debugging security rules.
      if (process.env.NODE_ENV === 'development') {
        // We throw the error in a timeout to break out of the current React render cycle
        // and ensure it's caught by Next.js's error overlay.
        setTimeout(() => {
          throw error;
        }, 0);
      } else {
        // In production, you might want to log this to a service like Sentry,
        // or display a user-friendly message.
        console.error("Firestore Permission Error:", error.message);
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  return null; // This component does not render anything
}
