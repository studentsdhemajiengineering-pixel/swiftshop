
'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentOrders, deliveredOrders } from '@/lib/data';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';

const OrderCard = ({ order }: { order: Order }) => {
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
                    {order.items.join(', ')}
                </p>
                <Separator className='my-3' />
                <div className='flex justify-between items-center'>
                    <div className='font-bold'>
                        ₹{order.total.toFixed(2)}
                    </div>
                     {order.status === 'Delivered' ? (
                        <Button variant="outline" size="sm">View Details</Button>
                    ) : (
                        <Button asChild size="sm">
                            <Link href="/track-order/map">Track Order</Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default function TrackOrderPage() {
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
                   <div className="space-y-4 py-4">
                     {currentOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                     ))}
                   </div>
                </TabsContent>
                <TabsContent value="delivered">
                    <div className="space-y-4 py-4">
                     {deliveredOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                     ))}
                   </div>
                </TabsContent>
            </Tabs>
        </div>
      </main>
    </div>
  );
}
