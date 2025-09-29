
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, Search, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/categories', label: 'Categories', icon: List },
  { href: '#', label: 'Search', icon: Search },
  { href: '/checkout', label: 'Cart', icon: ShoppingCart, isCart: true },
  { href: '/account', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { state } = useCart();
  const cartItemCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);

  // The checkout page has its own layout without the bottom nav
  if (pathname.startsWith('/checkout') || pathname.startsWith('/product/')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-top md:hidden z-50">
      <div className="container mx-auto px-2">
        <div className="grid grid-cols-5 items-center justify-items-center h-16">
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

                  {item.isCart && cartItemCount > 0 && (
                     <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {cartItemCount}
                     </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
