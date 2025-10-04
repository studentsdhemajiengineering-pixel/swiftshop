
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';

export const PrivateRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      if (adminOnly) {
        router.push('/admin/login');
      } else {
        router.push('/login');
      }
      return;
    }
    
    if (adminOnly && user.email !== 'admin@swiftshop.com') {
       router.push('/admin/login');
    }

  }, [user, isUserLoading, router, adminOnly]);

  if (isUserLoading || !user || (adminOnly && user.email !== 'admin@swiftshop.com')) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};
