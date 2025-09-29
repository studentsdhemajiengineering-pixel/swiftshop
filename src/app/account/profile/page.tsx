
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const ProfileHeader = () => {
    const router = useRouter();
    return (
        <header className="bg-background sticky top-0 z-40 border-b">
            <div className="container flex h-14 items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold flex-1">Edit Profile</h1>
            </div>
        </header>
    );
};

export default function ProfilePage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast({
            title: "Profile Updated",
            description: "Your profile information has been saved.",
        });
    }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <ProfileHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                    <AvatarFallback>SC</AvatarFallback>
                </Avatar>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Sophia Carter" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="sophia.carter@example.com" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+1 123 456 7890" />
            </div>

            <div className="pt-4">
                <Button type="submit" className="w-full">Save Changes</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
