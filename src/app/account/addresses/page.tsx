
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Edit2, Home, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const AddressesHeader = () => {
    const router = useRouter();
    return (
        <header className="bg-background sticky top-0 z-40 border-b">
            <div className="container flex h-14 items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold flex-1">Saved Addresses</h1>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
};

const savedAddresses = [
    {
        type: 'Home',
        address: '123, Green Avenue, Springfield, 12345',
        isDefault: true
    },
    {
        type: 'Work',
        address: '456, Business Tower, Metropolis, 67890',
        isDefault: false
    }
]

export default function AddressesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <AddressesHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {savedAddresses.map((item, index) => (
                 <Card key={index}>
                    <CardContent className="p-4 flex items-start gap-4">
                        <Home className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-grow">
                            <h3 className="font-semibold">{item.type}</h3>
                            <p className="text-muted-foreground text-sm">{item.address}</p>
                            {item.isDefault && (
                                <div className="text-xs font-medium text-primary mt-1">Default Address</div>
                            )}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
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
