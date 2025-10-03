
'use client';

import { allProducts, currentOrders, deliveredOrders } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import Image from 'next/image';

const OrderDetailHeader = () => {
    const router = useRouter();
    return (
        <header className="bg-background sticky top-0 z-40 border-b">
            <div className="container flex h-14 items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold flex-1">Order Details</h1>
            </div>
        </header>
    );
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const allOrders = [...currentOrders, ...deliveredOrders];
  const order = allOrders.find((o) => o.id === params.id);

  if (!order) {
    notFound();
  }

  const orderProducts = order.items
    .map(itemName => allProducts.find(p => p.name === itemName))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
        <OrderDetailHeader />
        <main className="flex-1">
            <div className="container mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                             <CardTitle>Order #{order.id}</CardTitle>
                             <p className="text-sm text-muted-foreground">
                                {format(new Date(order.date), "MMM dd, yyyy 'at' h:mm a")}
                            </p>
                        </CardHeader>
                        <CardContent>
                           <div className="flex items-center gap-3">
                                <ShoppingBag className="h-8 w-8 text-primary" />
                                <div>
                                    <h3 className="font-semibold">Order Status</h3>
                                    <p className="text-primary font-medium">{order.status}</p>
                                </div>
                           </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Items</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {orderProducts.map(product => {
                                return (
                                    <div key={product.id} className="flex items-start gap-4">
                                        {product.imageUrl && (
                                             <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                                             </div>
                                        )}
                                        <div className="flex-grow">
                                            <h4 className="font-medium">{product.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                               {product.variations[0].name}
                                            </p>
                                        </div>
                                         <p className="font-medium text-sm">₹{product.variations[0].price.toFixed(2)}</p>
                                    </div>
                                )
                             })}
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <div className="flex justify-between text-muted-foreground">
                                <span>Total</span>
                                <span>₹{order.total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-4">
                                <MapPin className="h-6 w-6 text-muted-foreground mt-1" />
                                <div>
                                    <p className="font-medium">Home</p>
                                    <p className="text-muted-foreground">123, Green Avenue, Springfield, 12345</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    </div>
  );
}
