
'use client';

import Link from 'next/link';
import { ChevronDown, MapPin, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartSheet } from '@/components/cart/cart-sheet';
import { useCart } from '@/hooks/use-cart';

export function Header() {
  const { state } = useCart();
  const cartItemCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-background sticky top-0 z-40 border-b">
      <div className="container flex h-16 items-center">
        <div className="flex items-start gap-2 flex-1">
          <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">Home</h3>
              <ChevronDown className="h-5 w-5" />
            </div>
            <p className="text-sm text-muted-foreground">
              123, Green Avenue, New York
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
           <Link href="/account" className="hidden md:inline-flex">
              <Button variant="ghost">
                <User className="h-5 w-5 mr-2" />
                Account
              </Button>
            </Link>
          <CartSheet>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </CartSheet>
        </div>
      </div>
    </header>
  );
}
