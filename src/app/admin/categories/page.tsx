
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlusCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/lib/firebase/service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import type { Category } from "@/lib/types";
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

const CategoryForm = ({ 
    category, 
    onSave, 
    onCancel 
}: { 
    category: Partial<Category> | null, 
    onSave: (category: Partial<Category>) => void, 
    onCancel: () => void 
}) => {
    const [formData, setFormData] = useState<Partial<Category>>(category || {});

    useEffect(() => {
        setFormData(category || {});
    }, [category]);

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
                <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" name="imageUrl" type="text" placeholder="https://example.com/image.jpg" value={formData.imageUrl || ''} onChange={handleChange} required />
                    <p className="text-xs text-muted-foreground">Paste an external URL for the category image.</p>
                    {formData.imageUrl && (
                        <Image src={formData.imageUrl} alt={formData.name || 'category image'} width={80} height={80} className="mt-2 rounded-md object-cover" />
                    )}
                </div>
            </div>
             <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Category</Button>
            </DialogFooter>
        </form>
    );
};


export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const { toast } = useToast();

     const fetchPageData = async () => {
        setLoading(true);
        try {
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPageData();
    }, []);

    const handleAddClick = () => {
        setEditingCategory(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (category: Category) => {
        setEditingCategory(category);
        setIsDialogOpen(true);
    };

    const handleDelete = async (categoryId: string) => {
        try {
            await deleteCategory(categoryId);
            toast({ title: "Category deleted successfully!" });
            fetchPageData();
        } catch (error) {
            console.error("Error deleting category:", error);
            toast({ title: "Error deleting category", description: (error as Error).message, variant: "destructive" });
        }
    };

    const handleSave = async (categoryData: Partial<Category>) => {
         if (!categoryData.name || !categoryData.imageUrl) {
            toast({ title: "Please fill all required fields", variant: "destructive" });
            return;
        }

        try {
            if (editingCategory?.id) {
                await updateCategory(editingCategory.id, categoryData);
                toast({ title: "Category updated successfully!" });
            } else {
                 await addCategory({ name: categoryData.name!, imageUrl: categoryData.imageUrl! });
                 toast({ title: "Category added successfully!" });
            }
            setIsDialogOpen(false);
            setEditingCategory(null);
            fetchPageData();
        } catch(e: any) {
            console.error("Error saving category:", e);
            toast({ title: "Error saving category", description: e.message, variant: "destructive" });
        }
    };
    
  return (
    <>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Categories</CardTitle>
                        <CardDescription>Manage your product categories.</CardDescription>
                    </div>
                    <Button onClick={handleAddClick}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Category
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                                Image
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && [...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell className="hidden sm:table-cell">
                                    <div className="aspect-square rounded-md bg-muted animate-pulse" />
                                </TableCell>
                                <TableCell><div className="h-5 w-3/4 rounded bg-muted animate-pulse" /></TableCell>
                                <TableCell><div className="h-8 w-16 rounded bg-muted animate-pulse" /></TableCell>
                            </TableRow>
                        ))}
                        {!loading && categories.map(category => {
                            return (
                                <TableRow key={category.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        {category.imageUrl && (
                                            <Image
                                                alt={category.name}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={category.imageUrl}
                                                width="64"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditClick(category)}>Edit</DropdownMenuItem>
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
                                                            This action cannot be undone. This will permanently delete the category and may affect products associated with it.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(category.id)}>Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      <Dialog open={isDialogOpen} onOpenChange={(open) => { if(!open) { setIsDialogOpen(false); setEditingCategory(null); } }}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            </DialogHeader>
            {isDialogOpen && (
                <CategoryForm 
                    category={editingCategory}
                    onSave={handleSave} 
                    onCancel={() => { setIsDialogOpen(false); setEditingCategory(null); }} 
                />
            )}
        </DialogContent>
     </Dialog>
    </>
  );
}
