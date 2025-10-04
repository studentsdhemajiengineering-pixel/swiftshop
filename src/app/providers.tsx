
'use client';

import { CartProvider } from '@/hooks/use-cart';
import type { ReactNode } from 'react';
import { FirebaseErrorListener } from '@/components/firebase/firebase-error-listener';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
      <CartProvider>
        {children}
      </CartProvider>
  );
}
