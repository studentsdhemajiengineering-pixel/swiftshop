
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Clock,
  CreditCard,
  Heart,
  HelpCircle,
  Bell,
  MapPin,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AccountHeader = () => {
    const router = useRouter();
    return (
        <header className="bg-background sticky top-0 z-40 border-b">
            <div className="container flex h-14 items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold flex-1">Account</h1>
            </div>
        </header>
    );
};

const settingsItems = [
  { icon: Clock, label: 'Order History', href: '/track-order' },
  { icon: MapPin, label: 'Saved Addresses', href: '/account/addresses' },
  { icon: Heart, label: 'Wishlist', href: '/account/wishlist' },
  { icon: Bell, label: 'Notifications', href: '/account/notifications' },
  { icon: CreditCard, label: 'Payment Methods', href: '/account/payments' },
  { icon: HelpCircle, label: 'Help & Support', href: '/account/support' },
];

export default function AccountPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <AccountHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
          
          {/* Profile Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src="https://picsum.photos/seed/sophia/200" alt="Sophia Carter" />
                    <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold text-lg">Sophia Carter</h3>
                    <Link href="/account/profile" className="text-sm text-primary">
                        Edit profile
                    </Link>
                </div>
            </div>
          </div>
          
          {/* Settings Section */}
          <div>
             <h2 className="text-xl font-bold mb-4">Settings</h2>
             <div className="space-y-2">
                {settingsItems.map((item) => (
                    <Link href={item.href} key={item.label}>
                        <div className="flex items-center p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/60 mr-4">
                                <item.icon className="h-5 w-5 text-secondary-foreground" />
                            </div>
                            <span className="flex-grow font-medium">{item.label}</span>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </Link>
                ))}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
