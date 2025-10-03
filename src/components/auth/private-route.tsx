
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export const PrivateRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      if (adminOnly) {
        router.push('/admin/login');
      } else {
        router.push('/login');
      }
      return;
    }
    
    if (adminOnly && user?.email !== 'admin@swiftshop.com') {
       router.push('/admin/login');
    }

  }, [isAuthenticated, loading, router, adminOnly, user]);

  if (loading || !isAuthenticated || (adminOnly && user?.email !== 'admin@swiftshop.com')) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};
