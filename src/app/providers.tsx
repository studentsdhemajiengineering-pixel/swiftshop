
'use client';

import { CartProvider } from '@/hooks/use-cart';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/hooks/use-auth';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
