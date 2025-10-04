
'use client';

import { useRouter, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { User, Order } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getOrders, getUser } from '@/lib/firebase/service';
import { Skeleton } from '@/components/ui/skeleton';

const CustomerDetailHeader = () => {
    const router = useRouter();
    return (
        <header className="bg-background sticky top-0 z-40 border-b">
            <div className="container flex h-14 items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold flex-1">Customer Details</h1>
            </div>
        </header>
    );
};

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      const fetchedUser = await getUser(params.id);
      if (fetchedUser) {
        setUser(fetchedUser);
        const allOrders = await getOrders();
        setUserOrders(allOrders.filter(o => o.userId === fetchedUser.id));
      }
      setLoading(false);
    };

    fetchCustomerData();
  }, [params.id]);

  if (loading) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/20">
            <CustomerDetailHeader />
            <main className="flex-1">
                <div className="container mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                    <p>Loading customer details...</p>
                </div>
            </main>
        </div>
    );
  }

  if (!user) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
        <CustomerDetailHeader />
        <main className="flex-1">
            <div className="container mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-6">
                   <div className="md:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-center flex flex-col items-center">
                               <Avatar className="h-24 w-24 text-3xl">
                                    <AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
                                    <p className="text-muted-foreground text-sm">{user.email}</p>
                                </div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle>Contact Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm">{user.email}</span>
                                </div>
                                 <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm">{user.phone || 'N/A'}</span>
                                </div>
                            </CardContent>
                        </Card>
                   </div>
                   <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Order History</CardTitle>
                                <Badge variant="outline">{userOrders.length} Orders</Badge>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {userOrders.length > 0 ? (
                                            userOrders.map(order => (
                                                <TableRow key={order.id}>
                                                    <TableCell className="font-medium">#{order.id}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{order.status}</Badge>
                                                    </TableCell>
                                                    <TableCell>₹{order.total.toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        <Button asChild variant="outline" size="sm">
                                                            <Link href={`/admin/orders/${order.id}`}>View</Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                                    No orders found for this customer.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                   </div>
                </div>
            </div>
        </main>
    </div>
  );
}
