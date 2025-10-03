
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlusCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/lib/firebase/service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Product } from "@/lib/types";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const ProductForm = ({ product, onSave, onCancel }: { product: Partial<Product> | null, onSave: (product: Partial<Product>) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState(product || {});

    useEffect(() => {
        setFormData(product || {});
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleVariationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const [field, indexStr] = name.split('-');
        const index = parseInt(indexStr, 10);
        
        setFormData(prev => {
            const variations = [...(prev.variations || [])];
            const currentVariation = variations[index] || {};
            
            let parsedValue: string | number = value;
            if (field === 'price' || field === 'inventory' || field === 'originalPrice') {
                parsedValue = value === '' ? '' : parseFloat(value);
            }

            variations[index] = { ...currentVariation, [field]: parsedValue };
            return { ...prev, variations };
        });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} required />
                </div>
                 <div className="space-y-2">
                    <Label>Variations</Label>
                    <div className="space-y-2">
                       {(formData.variations || [{}] as any).map((v: any, i: number) => (
                         <div key={i} className="grid grid-cols-3 gap-2">
                            <Input name={`name-${i}`} placeholder="Name (e.g. 1kg)" value={v.name || ''} onChange={handleVariationChange} />
                            <Input name={`price-${i}`} type="number" placeholder="Price" value={v.price || ''} onChange={handleVariationChange} />
                            <Input name={`inventory-${i}`} type="number" placeholder="Inventory" value={v.inventory || ''} onChange={handleVariationChange} />
                         </div>
                       ))}
                    </div>
                </div>
            </div>
             <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Product</Button>
            </DialogFooter>
        </form>
    );
};


export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const { toast } = useToast();

     const fetchProducts = async () => {
        setLoading(true);
        try {
            const fetchedProducts = await getProducts();
            setProducts(fetchedProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast({ title: "Error fetching products", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddClick = () => {
        setEditingProduct({
            name: '',
            description: '',
            imageId: 'product-fresh-vegetables', // Default image
            category: 'vegetables-fruits', // Default category
            variations: [{ id: '', name: '', price: 0, inventory: 0, unit: 'kg'}]
        });
        setIsDialogOpen(true);
    };

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    };

    const handleDelete = async (productId: string) => {
        try {
            await deleteProduct(productId);
            toast({ title: "Product deleted successfully!" });
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            toast({ title: "Error deleting product", variant: "destructive" });
        }
    };

    const handleSave = async (productData: Partial<Product>) => {
        try {
            if (editingProduct && 'id' in editingProduct && editingProduct.id) {
                await updateProduct(editingProduct.id, productData);
                toast({ title: "Product updated successfully!" });
            } else {
                 await addProduct(productData as Omit<Product, 'id'>);
                 toast({ title: "Product added successfully!" });
            }
            setIsDialogOpen(false);
            setEditingProduct(null);
            fetchProducts(); // Refresh data
        } catch(e) {
            console.error("Error saving product:", e);
            toast({ title: "Error saving product", variant: "destructive" });
        }
    };
    
  return (
     <Dialog open={isDialogOpen} onOpenChange={(open) => { if(!open) { setIsDialogOpen(false); setEditingProduct(null); } }}>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Products</CardTitle>
                        <CardDescription>Manage your products and view their sales performance.</CardDescription>
                    </div>
                    <Button onClick={handleAddClick}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Product
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
                            <TableHead>Status</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Inventory</TableHead>
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
                                <TableCell><div className="h-5 w-20 rounded bg-muted animate-pulse" /></TableCell>
                                <TableCell><div className="h-5 w-16 rounded bg-muted animate-pulse" /></TableCell>
                                <TableCell><div className="h-5 w-12 rounded bg-muted animate-pulse" /></TableCell>
                                <TableCell><div className="h-8 w-16 rounded bg-muted animate-pulse" /></TableCell>
                            </TableRow>
                        ))}
                        {!loading && products.map(product => {
                            const image = PlaceHolderImages.find((p) => p.id === product.imageId);
                            const totalInventory = product.variations.reduce((acc, v) => acc + v.inventory, 0);
                            return (
                                <TableRow key={product.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        {image && (
                                            <Image
                                                alt={product.name}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={image.imageUrl}
                                                width="64"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={totalInventory > 0 ? "default" : "destructive"}>
                                            {totalInventory > 0 ? 'In Stock' : 'Out of Stock'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>₹{product.variations[0]?.price.toFixed(2)}</TableCell>
                                    <TableCell>{totalInventory}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditClick(product)}>Edit</DropdownMenuItem>
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
                                                            This action cannot be undone. This will permanently delete the product.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(product.id)}>Continue</AlertDialogAction>
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
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingProduct && 'id' in editingProduct && editingProduct.id ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            {editingProduct && (
                <ProductForm 
                    product={editingProduct} 
                    onSave={handleSave} 
                    onCancel={() => { setIsDialogOpen(false); setEditingProduct(null); }} 
                />
            )}
        </DialogContent>
     </Dialog>
  );
}
