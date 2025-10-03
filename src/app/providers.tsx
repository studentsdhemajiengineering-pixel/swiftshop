
'use client';

import { CartProvider } from '@/hooks/use-cart';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/hooks/use-auth';
import { FirebaseErrorListener } from '@/components/firebase/firebase-error-listener';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <FirebaseErrorListener />
      </CartProvider>
    </AuthProvider>
  );
}
