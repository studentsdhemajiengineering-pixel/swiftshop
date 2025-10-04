
'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { PrivateRoute } from '@/components/auth/private-route';
import { addOrder } from '@/lib/firebase/service';
import { useAuth } from '@/hooks/use-auth';
import type { Order } from '@/lib/types';
import { Header } from '@/components/layout/header';

const CheckoutHeader = () => {
    const router = useRouter();
    return (
        <header className="bg-background sticky top-0 z-40 border-b md:hidden">
            <div className="container flex h-14 items-center">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold">Checkout</h1>
            </div>
        </header>
    );
};

function CheckoutPageContent() {
  const { state, dispatch } = useCart();
  const { user } = useAuth();
  const { cart } = state;
  const router = useRouter();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 50.00;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!user) {
        toast({ title: 'You must be logged in to place an order.', variant: 'destructive'});
        router.push('/login');
        return;
    }

    if (paymentMethod === 'phonepe') {
        router.push('/checkout/phonepe-payment');
        return;
    }
    
    setIsLoading(true);

    try {
        const orderData: Omit<Order, 'id'> = {
            userId: user.uid,
            customerName: user.displayName || user.phoneNumber || "Guest",
            items: cart.map(item => ({
                productId: item.productId,
                productName: item.name,
                variationId: item.variationId,
                variationName: item.unit,
                quantity: item.quantity,
                price: item.price,
                imageUrl: item.imageUrl
            })),
            date: new Date().toISOString(),
            status: 'Preparing',
            total: total,
            address: "123, Green Avenue, Springfield, 12345", // Dummy address for now
            paymentMethod: paymentMethod,
        };

        await addOrder(orderData);
        
        toast({
            title: "Order Placed!",
            description: "Thank you for your purchase. Your groceries are on the way."
        });
        dispatch({ type: 'CLEAR_CART' });
        router.push('/track-order');

    } catch (error) {
        console.error("Failed to place order:", error);
        toast({
            title: 'Failed to place order',
            description: 'There was an issue placing your order. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <div className='hidden md:block'><Header /></div>
            <CheckoutHeader />
            <main className="flex-1 flex items-center justify-center bg-secondary/10">
                <div className="text-center p-4">
                    <h1 className="text-2xl font-bold tracking-tight mb-4">Your Cart is Empty</h1>
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
    <div className="flex min-h-screen w-full flex-col bg-secondary/10">
      <div className='hidden md:block'><Header /></div>
      <CheckoutHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight mb-6 hidden md:block">Checkout</h1>
          <div className="space-y-6">
            
            <div>
              <h2 className="text-lg font-semibold mb-3">Delivery Address</h2>
              <div className="space-y-3">
                <Textarea placeholder="Street Address" className="min-h-[80px] bg-background" defaultValue="123, Green Avenue, Springfield, 12345" />
                <Input placeholder="City" className="bg-background" />
                <Input placeholder="State" className="bg-background" />
                <Input placeholder="Postal Code" className="bg-background" />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Delivery Date & Time</h2>
              <div className="space-y-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Select Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Select>
                    <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder={
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Select Time Slot</span>
                          </div>
                        } />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="9-11">9:00 AM - 11:00 AM</SelectItem>
                        <SelectItem value="11-13">11:00 AM - 1:00 PM</SelectItem>
                        <SelectItem value="13-15">1:00 PM - 3:00 PM</SelectItem>
                        <SelectItem value="15-17">3:00 PM - 5:00 PM</SelectItem>
                        <SelectItem value="17-19">5:00 PM - 7:00 PM</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
              <Card className="bg-background">
                <CardContent className="p-4 space-y-4">
                  {cart.map((item) => (
                    <div key={item.variationId} className="flex justify-between items-start">
                        <div>
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">{item.quantity} x {item.unit}</p>
                        </div>
                        <div className="font-medium text-sm text-right">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

             <div>
              <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
              <RadioGroup defaultValue="cod" onValueChange={setPaymentMethod} className="space-y-2">
                <Label htmlFor="cod" className="flex items-center justify-between p-4 rounded-lg border bg-background has-[:checked]:border-primary">
                  <span>Cash on Delivery</span>
                  <RadioGroupItem value="cod" id="cod" />
                </Label>
                <Label htmlFor="phonepe" className="flex items-center justify-between p-4 rounded-lg border bg-background has-[:checked]:border-primary">
                  <span>PhonePe</span>
                  <RadioGroupItem value="phonepe" id="phonepe" />
                </Label>
              </RadioGroup>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Total</h2>
              <Card className="bg-background">
                <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Delivery Fee</span>
                        <span>₹{deliveryFee.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </CardContent>
              </Card>
            </div>

            <div className="pt-4">
                <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Place Order
                </Button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
    return (
        <PrivateRoute>
            <CheckoutPageContent />
        </PrivateRoute>
    )
}
