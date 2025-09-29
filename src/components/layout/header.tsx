'use client';

import Link from 'next/link';
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  Package,
} from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CartSheet } from '@/components/cart/cart-sheet';
import { MobileNav } from './mobile-nav';

export function Header() {
  const { state } = useCart();
  const itemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        
        <div className="md:hidden mr-2">
          <MobileNav />
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-9 w-64"
              />
            </div>
          </div>
          <nav className="flex items-center space-x-2">
            <Link href="/account" className="hidden md:inline-flex">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>
            <Link href="/track-order" className="hidden md:inline-flex">
              <Button variant="ghost" size="icon">
                <Package className="h-5 w-5" />
                <span className="sr-only">Track Order</span>
              </Button>
            </Link>
            <CartSheet>
                <Button variant="outline" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {itemCount}
                        </span>
                    )}
                    <span className="hidden md:inline ml-2">Cart</span>
                </Button>
            </CartSheet>
          </nav>
        </div>
      </div>
    </header>
  );
}
