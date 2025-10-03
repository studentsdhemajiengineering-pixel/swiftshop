import type { Metadata } from 'next';
import { AppProviders } from '@/app/providers';
import { Toaster } from '@/components/ui/toaster';
import '../globals.css';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Checkout - SwiftShop',
  description: 'Complete your purchase.',
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FirebaseClientProvider>
      <AppProviders>
        {children}
        <Toaster />
      </AppProviders>
    </FirebaseClientProvider>
  );
}
