'use client';

import Link from 'next/link';
import {
  ChevronDown,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';


export function Header() {
  return (
    <header className="bg-background">
      <div className="container flex h-16 items-center">
        <div className="flex items-start gap-2">
            <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
                <div className='flex items-center gap-2'>
                    <h3 className="font-bold text-lg">Home</h3>
                    <ChevronDown className="h-5 w-5" />
                </div>
                <p className="text-sm text-muted-foreground">123, Green Avenue, New York</p>
            </div>
        </div>
      </div>
    </header>
  );
}
