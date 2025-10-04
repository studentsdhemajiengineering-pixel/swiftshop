
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Header } from '@/components/layout/header';

const PaymentsHeader = ({ onAdd }: { onAdd: () => void }) => {
    const router = useRouter();
    return (
        <header className="bg-background sticky top-0 z-40 border-b md:hidden">
            <div className="container flex h-14 items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold flex-1">Payment Methods</h1>
                <Button variant="outline" size="sm" onClick={onAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Add New
                </Button>
            </div>
        </header>
    );
};

const initialMethods = [
    {
        id: 'card-1',
        type: 'Credit Card',
        details: '**** **** **** 1234',
        icon: 'https://placehold.co/48x32/white/black?text=VISA'
    },
    {
        id: 'upi-1',
        type: 'PhonePe',
        details: 'user@ybl',
        icon: 'https://placehold.co/48x32/purple/white?text=P'
    }
]

export default function PaymentsPage() {
    const [methods, setMethods] = useState(initialMethods);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [methodType, setMethodType] = useState('card');
    const { toast } = useToast();

    const handleSaveMethod = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        let newMethod;

        if (methodType === 'card') {
            const cardNumber = formData.get('cardNumber') as string;
            newMethod = {
                id: `card-${Date.now()}`,
                type: 'Credit Card',
                details: `**** **** **** ${cardNumber.slice(-4)}`,
                icon: 'https://placehold.co/48x32/white/black?text=VISA'
            };
        } else {
            const upiId = formData.get('upiId') as string;
            newMethod = {
                id: `upi-${Date.now()}`,
                type: 'UPI',
                details: upiId,
                icon: 'https://placehold.co/48x32/blue/white?text=UPI'
            };
        }
        
        setMethods([...methods, newMethod]);
        toast({ title: 'Payment method added successfully!' });
        setIsDialogOpen(false);
    };

    const handleDeleteMethod = (id: string) => {
        setMethods(methods.filter(m => m.id !== id));
        toast({ title: 'Payment method deleted.' });
    };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <div className='hidden md:block'><Header /></div>
      <PaymentsHeader onAdd={() => setIsDialogOpen(true)} />
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
            <div className='flex justify-between items-center mb-6'>
                <h1 className="text-2xl font-bold tracking-tight hidden md:block">Payment Methods</h1>
                <Button onClick={() => setIsDialogOpen(true)} className='hidden md:flex'>
                    <Plus className="mr-2 h-4 w-4" /> Add New Method
                </Button>
            </div>
          <div className="space-y-4">
            {methods.map((item) => (
                 <Card key={item.id}>
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
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteMethod(item.id)}>
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
                <DialogTitle>Add New Payment Method</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveMethod}>
                <RadioGroup defaultValue="card" onValueChange={setMethodType} className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <RadioGroupItem value="card" id="card" className="peer sr-only" />
                        <Label
                        htmlFor="card"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                        Card
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
                        <Label
                        htmlFor="upi"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                        UPI
                        </Label>
                    </div>
                </RadioGroup>

                {methodType === 'card' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" name="cardNumber" placeholder="0000 0000 0000 0000" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="expiry">Expiry</Label>
                                <Input id="expiry" name="expiry" placeholder="MM/YY" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input id="cvv" name="cvv" placeholder="123" required />
                            </div>
                        </div>
                    </div>
                )}
                {methodType === 'upi' && (
                    <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input id="upiId" name="upiId" placeholder="yourname@bank" required />
                    </div>
                )}

                <DialogFooter className="mt-6">
                    <Button type="submit">Save Method</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </div>
    </Dialog>
  );
}
