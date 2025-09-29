
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image';

const PaymentsHeader = () => {
    const router = useRouter();
    return (
        <header className="bg-background sticky top-0 z-40 border-b">
            <div className="container flex h-14 items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold flex-1">Payment Methods</h1>
                <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add New
                </Button>
            </div>
        </header>
    );
};

const savedMethods = [
    {
        type: 'Credit Card',
        details: '**** **** **** 1234',
        icon: 'https://placehold.co/48x32/white/black?text=VISA'
    },
    {
        type: 'PhonePe',
        details: 'user@ybl',
        icon: 'https://placehold.co/48x32/purple/white?text=P'
    }
]

export default function PaymentsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <PaymentsHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {savedMethods.map((item, index) => (
                 <Card key={index}>
                    <CardContent className="p-4 flex items-center gap-4">
                         <Image src={item.icon} alt={item.type} width={48} height={32} />
                        <div className="flex-grow">
                            <h3 className="font-semibold">{item.type}</h3>
                            <p className="text-muted-foreground text-sm">{item.details}</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardContent>
                 </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
