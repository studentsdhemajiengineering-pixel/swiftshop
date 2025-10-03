

'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getOrders } from "@/lib/firebase/service";
import type { Order } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>View and manage all customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                     {loading && [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                        </TableRow>
                    ))}
                    {!loading && orders.map(order => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell>{format(new Date(order.date), "MMM dd, yyyy")}</TableCell>
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
  );
}
