
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/header';

const AddressesHeader = ({ onAdd }: { onAdd: () => void }) => {
    const router = useRouter();
    return (
        <header className="bg-background sticky top-0 z-40 border-b md:hidden">
            <div className="container flex h-14 items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold flex-1">Saved Addresses</h1>
                <Button variant="ghost" size="icon" onClick={onAdd} className="h-8 w-8">
                    <Plus className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
};

const initialAddresses = [
    {
        id: 1,
        type: 'Home',
        address: '123, Green Avenue, Springfield, 12345',
        isDefault: true
    },
    {
        id: 2,
        type: 'Work',
        address: '456, Business Tower, Metropolis, 67890',
        isDefault: false
    }
]

export default function AddressesPage() {
    const [addresses, setAddresses] = useState(initialAddresses);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<typeof initialAddresses[0] | null>(null);
    const { toast } = useToast();

    const handleSaveAddress = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newAddress = {
            id: editingAddress ? editingAddress.id : Date.now(),
            type: formData.get('type') as string,
            address: formData.get('address') as string,
            isDefault: editingAddress ? editingAddress.isDefault : false
        };

        if (editingAddress) {
            setAddresses(addresses.map(addr => addr.id === newAddress.id ? newAddress : addr));
            toast({ title: 'Address updated successfully!' });
        } else {
            setAddresses([...addresses, newAddress]);
            toast({ title: 'Address added successfully!' });
        }
        setIsDialogOpen(false);
        setEditingAddress(null);
    };

    const handleDeleteAddress = (id: number) => {
        setAddresses(addresses.filter(addr => addr.id !== id));
        toast({ title: 'Address deleted.' });
    };

    const handleSetDefault = (id: number) => {
        setAddresses(addresses.map(addr => ({ ...addr, isDefault: addr.id === id })));
        toast({ title: 'Default address updated.' });
    };

    const openAddDialog = () => {
        setEditingAddress(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (address: typeof initialAddresses[0]) => {
        setEditingAddress(address);
        setIsDialogOpen(true);
    };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <div className='hidden md:block'><Header /></div>
      <AddressesHeader onAdd={openAddDialog} />
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
            <div className='flex justify-between items-center mb-6'>
                <h1 className="text-2xl font-bold tracking-tight hidden md:block">Saved Addresses</h1>
                <Button onClick={openAddDialog} className='hidden md:flex'>
                    <Plus className="mr-2 h-4 w-4" /> Add New Address
                </Button>
            </div>
          <div className="space-y-4">
            {addresses.map((item) => (
                 <Card key={item.id}>
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
                                <DropdownMenuItem onClick={() => openEditDialog(item)}>
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                {!item.isDefault && (
                                     <DropdownMenuItem onClick={() => handleSetDefault(item.id)}>
                                        Set as Default
                                     </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAddress(item.id)}>
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
      <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveAddress}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Input id="type" name="type" placeholder="e.g. Home, Work" defaultValue={editingAddress?.type} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" placeholder="123, Main Street..." defaultValue={editingAddress?.address} required />
                    </div>
                </div>
                <DialogFooter className="mt-6">
                    <Button type="submit">Save Address</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </div>
    </Dialog>
  );
}
