
'use client';

import { useState, useEffect } from 'react';
import { currentOrders, deliveredOrders, allProducts } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, MapPin, User, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Order, Product } from '@/lib/types';

const OrderDetailHeader = ({orderId}: {orderId: string}) => {
    const router = useRouter();
    return (
        <header className="bg-background sticky top-0 z-40 border-b">
            <div className="container flex h-14 items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold flex-1">Order #{orderId}</h1>
            </div>
        </header>
    );
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const allOrders = [...currentOrders, ...deliveredOrders];
  const initialOrder = allOrders.find((o) => o.id === params.id);
  
  const [order, setOrder] = useState<Order | undefined>(initialOrder);
  const { toast } = useToast();

  if (!order) {
    notFound();
  }
  
  const orderProducts = order.items
    .map(itemName => {
      const product = allProducts.find(p => p.name === itemName);
      // In a real app, you'd probably store quantity and selected variation in the order item
      return product ? { ...product, quantity: 1, variation: product.variations[0] } : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const handleStatusChange = (newStatus: Order['status']) => {
    setOrder(prevOrder => prevOrder ? { ...prevOrder, status: newStatus } : undefined);
    // In a real app, this is where you'd call a function to update the order in your database.
    // e.g., `updateOrderStatus(order.id, newStatus);`
    toast({
        title: "Order Status Updated",
        description: `Order #${order.id} is now marked as ${newStatus}.`,
    })
  };

  const statusOptions: Order['status'][] = ['Preparing', 'Out for Delivery', 'Delivered'];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
        <OrderDetailHeader orderId={order.id} />
        <main className="flex-1">
            <div className="container mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-6">
                   <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Items</CardTitle>
                                <Badge 
                                    className={`
                                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                                        ${order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-800' : ''}
                                        ${order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800' : ''}
                                    `}
                                    variant="outline"
                                >
                                    {order.status}
                                </Badge>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {orderProducts.map(product => (
                                    <div key={product.id} className="flex items-start gap-4">
                                        {product.imageUrl && (
                                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-grow">
                                            <h4 className="font-medium">{product.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {product.variation.name} x {product.quantity}
                                            </p>
                                        </div>
                                        <p className="font-medium text-sm">₹{product.variation.price.toFixed(2)}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>₹{(order.total - 50).toFixed(2)}</span>
                                </div>
                                 <div className="flex justify-between text-muted-foreground">
                                    <span>Delivery Fee</span>
                                    <span>₹50.00</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{order.total.toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>
                   </div>
                   <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Update Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between">
                                            <span>{order.status}</span>
                                            <Package className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                        {statusOptions.map(status => (
                                            <DropdownMenuItem key={status} onClick={() => handleStatusChange(status)}>
                                                {status}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium">Liam Johnson</span>
                                </div>
                                 <div className="flex items-center gap-3">
                                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">COD</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Delivery Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                                    <div>
                                        <p className="font-medium">Home</p>
                                        <p className="text-muted-foreground text-sm">123, Green Avenue, Springfield, 12345</p>
                                        <p className="text-muted-foreground text-sm">+91 98765 43210</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                   </div>
                </div>
            </div>
        </main>
    </div>
  );
}

    