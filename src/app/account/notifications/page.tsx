
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const NotificationsHeader = () => {
    const router = useRouter();
    return (
        <header className="bg-background sticky top-0 z-40 border-b">
            <div className="container flex h-14 items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold flex-1">Notifications</h1>
            </div>
        </header>
    );
};

const notificationSettings = [
    { id: 'promotions', label: 'Promotions & Offers' },
    { id: 'order_updates', label: 'Order Updates' },
    { id: 'reminders', label: 'Reminders' },
    { id: 'app_updates', label: 'App Updates' },
]

export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <NotificationsHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {notificationSettings.map((setting) => (
                 <div key={setting.id} className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor={setting.id} className="font-medium text-base">
                        {setting.label}
                    </Label>
                    <Switch id={setting.id} defaultChecked={setting.id === 'order_updates'} />
                 </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
