
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
import { getOrders } from '@/lib/firebase/service';
import { Skeleton } from '@/components/ui/skeleton';

const dummyUsers: User[] = [
    { id: 'usr_1', firstName: 'Liam', lastName: 'Johnson', email: 'liam@example.com', phone: '+1-202-555-0141' },
    { id: 'usr_2', firstName: 'Olivia', lastName: 'Smith', email: 'olivia@example.com', phone: '+1-202-555-0192' },
    { id: 'usr_3', firstName: 'Noah', lastName: 'Williams', email: 'noah@example.com', phone: '+1-202-555-0128' },
    { id: 'usr_4', firstName: 'Emma', lastName: 'Brown', email: 'emma@example.com', phone: '+1-202-555-0115' },
    { id: 'usr_5', firstName: 'Oliver', lastName: 'Jones', email: 'oliver@example.com', phone: '+1-202-555-0177' },
];


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
  const user = dummyUsers.find(u => u.id === params.id);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const allOrders = await getOrders();
      // In a real app, the user ID would match the Firebase Auth UID.
      // For this demo with dummy users, we'll just assign some orders.
      const customerId = user?.id; 
      if (customerId === 'usr_1') { // Liam Johnson
          setUserOrders(allOrders.filter(o => o.customerName === 'Liam Johnson'));
      } else if (customerId === 'usr_2') { // Olivia Smith
          setUserOrders(allOrders.filter(o => o.customerName === 'Olivia Smith'));
      } else if (customerId === 'usr_3') { // Noah Williams
          setUserOrders(allOrders.filter(o => o.customerName === 'Noah Williams'));
      } else if (customerId === 'usr_4') { // Emma Brown
          setUserOrders(allOrders.filter(o => o.customerName === 'Emma Brown'));
      } else {
          setUserOrders([]);
      }
      setLoading(false);
    };

    if(user) {
        fetchOrders();
    }
  }, [user]);

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
                                    <span className="text-sm">{user.phone}</span>
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
                                        {loading ? (
                                            [...Array(2)].map((_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                                    <TableCell><Skeleton className="h-8 w-14" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : userOrders.length > 0 ? (
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
