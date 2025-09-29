'use client'

import Link from 'next/link';
import { Menu, Package, Search, User } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import React from 'react';

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <Logo onClick={() => setOpen(false)} />
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-4 py-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search products..." className="pl-9" />
          </div>
          <Separator />
          <nav className="flex flex-col space-y-2">
            <Link href="/account" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-2 text-base">
                <User className="h-5 w-5" />
                My Account
              </Button>
            </Link>
            <Link href="/track-order" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-2 text-base">
                <Package className="h-5 w-5" />
                Track Order
              </Button>
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
