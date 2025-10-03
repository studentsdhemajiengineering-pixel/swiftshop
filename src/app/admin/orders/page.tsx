
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { currentOrders, deliveredOrders } from "@/lib/data";
import { format } from "date-fns";
import Link from "next/link";

export default function AdminOrdersPage() {
  const allOrders = [...currentOrders, ...deliveredOrders].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
                    {allOrders.map(order => (
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
