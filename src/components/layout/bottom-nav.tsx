'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Package, Printer, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/track-order', label: 'Order Again', icon: Package },
  { href: '/categories', label: 'Categories', icon: LayoutGrid },
  { href: '/print', label: 'Print', icon: Printer },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-top md:hidden">
      <div className="container mx-auto px-2">
        <div className="grid grid-cols-5 items-center justify-items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link href={item.href} key={item.label}>
                <div
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 text-muted-foreground',
                    isActive && 'text-primary'
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
          <Button className="h-10 bg-red-500 hover:bg-red-600 text-white font-bold px-4 rounded-lg">
            Zomato
          </Button>
        </div>
      </div>
    </div>
  );
}
