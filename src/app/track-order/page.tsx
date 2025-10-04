

'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getOrders } from '@/lib/firebase/service';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

const OrderCard = ({ order }: { order: Order }) => {
    const itemsSummary = order.items.map(i => i.productName).join(', ');
    return (
        <Card>
            <CardHeader>
                <div className='flex justify-between items-start'>
                    <div>
                        <CardTitle className='text-base font-bold'>Order #{order.id}</CardTitle>
                        <CardDescription className='text-xs'>
                            {format(new Date(order.date), "MMM dd, yyyy 'at' h:mm a")}
                        </CardDescription>
                    </div>
                     <div 
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}
                    >
                        {order.status}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground truncate">
                    {itemsSummary}
                </p>
                <Separator className='my-3' />
                <div className='flex justify-between items-center'>
                    <div className='font-bold'>
                        ₹{order.total.toFixed(2)}
                    </div>
                     {order.status === 'Delivered' ? (
                        <Button asChild variant="outline" size="sm">
                           <Link href={`/order/${order.id}`}>View Details</Link>
                        </Button>
                    ) : (
                        <Button asChild size="sm">
                            <Link href={`/order/${order.id}`}>Track Order</Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

const OrderListSkeleton = () => (
    <div className="space-y-4 py-4">
        {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <div className='flex justify-between items-start'>
                        <div>
                            <Skeleton className="h-5 w-24 mb-1" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </CardHeader>
                <CardContent>
                     <Skeleton className="h-4 w-full mb-3" />
                    <Separator className='my-3' />
                    <div className='flex justify-between items-center'>
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

export default function TrackOrderPage() {
  const { user, isUserLoading: authLoading } = useFirebase();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
        return; 
    }

    const fetchOrders = async () => {
        setLoading(true);
        if (user) {
            const fetchedOrders = await getOrders();
            setOrders(fetchedOrders);
        } else {
            setOrders([]);
        }
        setLoading(false);
    }
    
    fetchOrders();

  }, [user, authLoading]);

  const currentOrders = orders.filter(o => o.status !== 'Delivered');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  const isLoading = authLoading || loading;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
           <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="current">Current Orders</TabsTrigger>
                    <TabsTrigger value="delivered">Delivered</TabsTrigger>
                </TabsList>
                <TabsContent value="current">
                   {isLoading ? <OrderListSkeleton /> : (
                       <div className="space-y-4 py-4">
                         {currentOrders.length > 0 ? currentOrders.map(order => (
                            <OrderCard key={order.id} order={order} />
                         )) : <p className="text-center text-muted-foreground py-10">No current orders found.</p>}
                       </div>
                   )}
                </TabsContent>
                <TabsContent value="delivered">
                    {isLoading ? <OrderListSkeleton /> : (
                        <div className="space-y-4 py-4">
                        {deliveredOrders.length > 0 ? deliveredOrders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        )) : <p className="text-center text-muted-foreground py-10">No delivered orders found.</p>}
                      </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
      </main>
    </div>
  );
}
