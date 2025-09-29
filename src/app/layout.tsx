
import type { Metadata } from 'next';
import { AppProviders } from '@/app/providers';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { BottomNav } from '@/components/layout/bottom-nav';

export const metadata: Metadata = {
  title: 'SwiftShop',
  description: 'Your groceries, delivered in a flash.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppProviders>
          <div className="pb-20 md:pb-0">
           {children}
          </div>
          <BottomNav />
        </AppProviders>
        <Toaster />
      </body>
    </html>
  );
}
