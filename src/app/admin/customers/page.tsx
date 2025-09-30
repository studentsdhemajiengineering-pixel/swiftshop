
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const customers = [
    { name: "Liam Johnson", email: "liam@example.com", totalSpent: "₹2500.00" },
    { name: "Olivia Smith", email: "olivia@example.com", totalSpent: "₹1500.00" },
    { name: "Noah Williams", email: "noah@example.com", totalSpent: "₹3500.00" },
    { name: "Emma Brown", email: "emma@example.com", totalSpent: "₹4500.00" },
    { name: "Oliver Jones", email: "oliver@example.com", totalSpent: "₹5500.00" },
]

export default function AdminCustomersPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Customers</CardTitle>
            <CardDescription>Manage your customers and view their purchase history.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total Spent</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map(customer => (
                        <TableRow key={customer.email}>
                             <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{customer.name}</div>
                                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{customer.totalSpent}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
