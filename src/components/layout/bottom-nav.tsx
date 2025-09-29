
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, Package, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/categories', label: 'Category', icon: List },
  { href: '/track-order', label: 'Order', icon: Package },
  { href: '/account', label: 'Account', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  // The checkout page has its own layout without the bottom nav
  if (pathname.startsWith('/checkout') || pathname.startsWith('/product/')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-top md:hidden z-50">
      <div className="container mx-auto px-2">
        <div className="grid grid-cols-4 items-center justify-items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link href={item.href} key={item.label}>
                <div
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 text-muted-foreground w-full h-full pt-2 relative',
                    isActive && 'text-primary'
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
