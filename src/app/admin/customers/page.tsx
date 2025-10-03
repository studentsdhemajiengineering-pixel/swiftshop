
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlusCircle, MoreHorizontal, Trash2, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";


const UserForm = ({ 
    user,
    onSave, 
    onCancel 
}: { 
    user: Partial<User> | null, 
    onSave: (user: Partial<User>) => void, 
    onCancel: () => void 
}) => {
    const [formData, setFormData] = useState<Partial<User>>(user || {});

    useEffect(() => {
        setFormData(user || {});
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" value={formData.firstName || ''} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" value={formData.lastName || ''} onChange={handleChange} required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} required />
                </div>
            </div>
             <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Customer</Button>
            </DialogFooter>
        </form>
    );
};

const dummyUsers: User[] = [
    { id: 'usr_1', firstName: 'Liam', lastName: 'Johnson', email: 'liam@example.com', phone: '+1-202-555-0141' },
    { id: 'usr_2', firstName: 'Olivia', lastName: 'Smith', email: 'olivia@example.com', phone: '+1-202-555-0192' },
    { id: 'usr_3', firstName: 'Noah', lastName: 'Williams', email: 'noah@example.com', phone: '+1-202-555-0128' },
    { id: 'usr_4', firstName: 'Emma', lastName: 'Brown', email: 'emma@example.com', phone: '+1-202-555-0115' },
    { id: 'usr_5', firstName: 'Oliver', lastName: 'Jones', email: 'oliver@example.com', phone: '+1-202-555-0177' },
];

export default function AdminCustomersPage() {
    const [users, setUsers] = useState<User[]>(dummyUsers);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
    const { toast } = useToast();
    
    const handleAddClick = () => {
        setEditingUser({ firstName: '', lastName: '', email: '', phone: '' });
        setIsDialogOpen(true);
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setIsDialogOpen(true);
    };

    const handleDelete = async (userId: string) => {
        setUsers(users.filter(u => u.id !== userId));
        toast({ title: "Customer deleted successfully!" });
    };

    const handleSave = async (userData: Partial<User>) => {
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.phone) {
            toast({ title: "Please fill all required fields", variant: "destructive" });
            return;
        }

        if (editingUser && editingUser.id) {
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
            toast({ title: "Customer updated successfully!" });
        } else {
             const newUser = { ...userData, id: `usr_${Date.now()}` } as User;
             setUsers([...users, newUser]);
             toast({ title: "Customer added successfully!" });
        }
        setIsDialogOpen(false);
        setEditingUser(null);
    };
    
  return (
    <>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Customers</CardTitle>
                        <CardDescription>Manage your customers and view their purchase history.</CardDescription>
                    </div>
                    <Button onClick={handleAddClick}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Customer
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && [...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div>
                                            <Skeleton className="h-4 w-24 mb-1" />
                                            <Skeleton className="h-3 w-32" />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                            </TableRow>
                        ))}
                        {!loading && users.map(user => (
                            <TableRow key={user.id}>
                                 <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/customers/${user.id}`}><Eye className="mr-2 h-4 w-4" />View</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleEditClick(user)}>Edit</DropdownMenuItem>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete this customer's account.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(user.id)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { if(!open) { setIsDialogOpen(false); setEditingUser(null); } }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingUser && editingUser.id ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
                </DialogHeader>
                {isDialogOpen && (
                    <UserForm 
                        user={editingUser}
                        onSave={handleSave} 
                        onCancel={() => { setIsDialogOpen(false); setEditingUser(null); }} 
                    />
                )}
            </DialogContent>
        </Dialog>
    </>
  );
}
