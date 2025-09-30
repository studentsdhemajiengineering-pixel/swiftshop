
'use client';

import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="hidden md:block bg-secondary text-secondary-foreground border-t mt-12">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm">
              Your groceries, delivered in a flash.
            </p>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary">Careers</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary">Blog</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link href="/account/support" className="text-sm hover:text-primary">Contact Us</Link></li>
              <li><Link href="/track-order" className="text-sm hover:text-primary">Track Order</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-primary">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Facebook className="h-5 w-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Twitter className="h-5 w-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Instagram className="h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} SwiftShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
