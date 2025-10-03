
'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User as UserIcon, Mail, Phone, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getUser } from '@/lib/firebase/service';
import type { User } from '@/lib/types';
import { currentOrders } from '@/lib/data'; // Using mock data for now
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Link from 'next/link';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
        setLoading(true);
        try {
            const fetchedUser = await getUser(params.id);
            if (fetchedUser) {
                setUser(fetchedUser);
            } else {
                notFound();
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            // notFound() could be called here as well if the error is a permission error
        } finally {
            setLoading(false);
        }
    };
    fetchUser();
  }, [params.id]);


  if (loading) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/20">
             <CustomerDetailHeader />
             <main className="flex-1">
                <div className="container mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                    <p>Loading...</p>
                </div>
             </main>
        </div>
    )
  }

  if (!user) {
    notFound();
  }

  // TODO: Fetch real orders for this user
  const userOrders = currentOrders.slice(0, 2);

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
                                        {userOrders.map(order => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">{order.id}</TableCell>
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
                                        ))}
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
