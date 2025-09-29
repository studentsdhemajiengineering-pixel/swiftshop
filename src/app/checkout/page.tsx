
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const { cart } = state;
  const router = useRouter();
  const { toast } = useToast();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    // In a real app, you would process the payment here.
    toast({
        title: "Order Placed!",
        description: "Thank you for your purchase. Your groceries are on the way."
    });
    dispatch({ type: 'CLEAR_CART' });
    router.push('/track-order');
  }

  if (cart.length === 0) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center bg-secondary/30">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight mb-4">Your Cart is Empty</h1>
                    <p className="text-muted-foreground mb-6">You can't checkout without any items.</p>
                    <Button asChild>
                        <Link href="/">Start Shopping</Link>
                    </Button>
                </div>
            </main>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight font-headline">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Shipping & Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Shipping Address</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" placeholder="123 Greenfield Lane" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" placeholder="Fresh Meadows" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zip">ZIP Code</Label>
                                <Input id="zip" placeholder="12345" />
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Payment Details</h3>
                        <div className="space-y-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <div className="relative">
                                <Input id="card-number" placeholder="**** **** **** ****" className="pl-10" />
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input id="expiry" placeholder="MM / YY" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="cvc">CVC</Label>
                                <Input id="cvc" placeholder="123" />
                            </div>
                        </div>
                    </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
                <Card className="shadow-lg sticky top-24">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                        <CardDescription>Review your items before placing the order.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
                             {cart.map((item) => {
                                const image = PlaceHolderImages.find((p) => p.id === item.imageId);
                                return (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                            {image && <Image src={image.imageUrl} alt={item.name} fill className="object-cover" />}
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-medium text-sm">{item.name}</h4>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                );
                            })}
                        </div>
                       <Separator />
                       <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between text-sm">
                                <span>Shipping</span>
                                <span>${shipping.toFixed(2)}</span>
                            </div>
                       </div>
                       <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <Button className="w-full" size="lg" onClick={handlePlaceOrder}>
                            <DollarSign className="mr-2 h-5 w-5" />
                            Place Order
                        </Button>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
