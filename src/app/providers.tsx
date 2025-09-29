'use client';

import { CartProvider } from '@/hooks/use-cart';
import type { ReactNode } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
