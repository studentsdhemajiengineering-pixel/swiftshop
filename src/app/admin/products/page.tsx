
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlusCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { getProducts, addProduct, updateProduct, deleteProduct, getCategories, uploadImage } from "@/lib/firebase/service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { Product, Category } from "@/lib/types";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const ProductForm = ({ 
    product, 
    categories, 
    onSave, 
    onCancel 
}: { 
    product: Partial<Product> | null, 
    categories: Category[],
    onSave: (product: Partial<Product>, imageFile: File | null) => void, 
    onCancel: () => void 
}) => {
    const [formData, setFormData] = useState<Partial<Product>>(product || {});
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        setFormData(product || {});
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({...prev, [name]: value}));
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleVariationChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = e.target;
        const variations = [...(formData.variations || [])];
        const currentVariation = variations[index] || {};
        
        let parsedValue: string | number = value;
        if (name === 'price' || name === 'inventory' || name === 'originalPrice') {
            parsedValue = value === '' ? '' : parseFloat(value);
        }

        variations[index] = { ...currentVariation, [name]: parsedValue };
        setFormData(prev => ({ ...prev, variations }));
    }

    const addVariation = () => {
        setFormData(prev => ({
            ...prev,
            variations: [...(prev.variations || []), { id: `new-${Date.now()}`, name: '', price: 0, inventory: 0, unit: 'kg' }]
        }));
    }
    
    const removeVariation = (index: number) => {
        setFormData(prev => ({
            ...prev,
            variations: (prev.variations || []).filter((_, i) => i !== index)
        }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, imageFile);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" value={formData.category || ''} onValueChange={(value) => handleSelectChange('category', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="image">Image</Label>
                        <Input id="image" name="image" type="file" onChange={handleImageChange} accept="image/*" />
                        {formData.imageUrl && !imageFile && (
                            <Image src={formData.imageUrl} alt={formData.name || 'product image'} width={80} height={80} className="mt-2 rounded-md object-cover" />
                        )}
                    </div>
                </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label>Variations</Label>
                        <Button type="button" size="sm" variant="outline" onClick={addVariation}>Add Variation</Button>
                    </div>
                    <div className="space-y-3">
                       {(formData.variations || []).map((v: any, i: number) => (
                         <div key={v.id || i} className="space-y-2 p-3 border rounded-md relative">
                            { (formData.variations?.length || 0) > 1 &&
                                <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeVariation(i)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            }
                            <div className="grid grid-cols-2 gap-2">
                                <Input name="name" placeholder="Name (e.g. 1kg)" value={v.name || ''} onChange={(e) => handleVariationChange(e, i)} />
                                <Select name="unit" value={v.unit || 'kg'} onValueChange={(value) => handleVariationChange({target: {name: 'unit', value}} as any, i)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="kg">kg</SelectItem>
                                        <SelectItem value="g">g</SelectItem>
                                        <SelectItem value="piece">piece</SelectItem>
                                        <SelectItem value="liter">liter</SelectItem>
                                        <SelectItem value="ml">ml</SelectItem>
                                        <SelectItem value="dozen">dozen</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="grid grid-cols-3 gap-2">
                                <Input name="price" type="number" placeholder="Price" value={v.price || ''} onChange={(e) => handleVariationChange(e, i)} />
                                <Input name="originalPrice" type="number" placeholder="Original Price" value={v.originalPrice || ''} onChange={(e) => handleVariationChange(e, i)} />
                                <Input name="inventory" type="number" placeholder="Inventory" value={v.inventory || ''} onChange={(e) => handleVariationChange(e, i)} />
                            </div>
                         </div>
                       ))}
                    </div>
                </div>
            </div>
             <DialogFooter className="mt-6 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Product</Button>
            </DialogFooter>
        </form>
    );
};


export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const { toast } = useToast();

     const fetchPageData = async () => {
        setLoading(true);
        try {
            const [fetchedProducts, fetchedCategories] = await Promise.all([getProducts(), getCategories()]);
            setProducts(fetchedProducts);
            setCategories(fetchedCategories);
        } catch (error) {
            console.error("Error fetching page data:", error);
            // The service will emit a permission error, so we don't need a toast here
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPageData();
    }, []);

    const handleAddClick = () => {
        setEditingProduct({
            name: '',
            description: '',
            imageUrl: '',
            category: categories[0]?.id || '',
            variations: [{ id: `new-${Date.now()}`, name: '', price: 0, inventory: 0, unit: 'kg'}]
        });
        setIsDialogOpen(true);
    };

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    };

    const handleDelete = (productId: string) => {
        try {
            deleteProduct(productId);
            toast({ title: "Product deleted successfully!" });
            fetchPageData();
        } catch (error) {
            console.error("Error deleting product:", error);
            toast({ title: "Error deleting product", description: (error as Error).message, variant: "destructive" });
        }
    };

    const handleSave = async (productData: Partial<Product>, imageFile: File | null) => {
        if (!productData.name || !productData.category || !productData.variations || productData.variations.length === 0) {
            toast({ title: "Please fill all required fields", variant: "destructive" });
            return;
        }

        try {
            let finalProductData = { ...productData };

            if (imageFile) {
                const imageUrl = await uploadImage(imageFile, 'products');
                finalProductData.imageUrl = imageUrl;
            } else if (!finalProductData.imageUrl) {
                toast({ title: "Please upload an image", variant: "destructive" });
                return;
            }

            if (editingProduct && 'id' in editingProduct && editingProduct.id) {
                await updateProduct(editingProduct.id, finalProductData);
                toast({ title: "Product updated successfully!" });
            } else {
                 await addProduct(finalProductData as Omit<Product, 'id'>);
                 toast({ title: "Product added successfully!" });
            }
            setIsDialogOpen(false);
            setEditingProduct(null);
            fetchPageData();
        } catch(e) {
            console.error("Error saving product:", e);
            toast({ title: "Error saving product", description: (e as Error).message, variant: "destructive" });
        }
    };
    
  return (
    <>
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
                            const totalInventory = product.variations.reduce((acc, v) => acc + v.inventory, 0);
                            return (
                                <TableRow key={product.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        {product.imageUrl && (
                                            <Image
                                                alt={product.name}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={product.imageUrl}
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
      <Dialog open={isDialogOpen} onOpenChange={(open) => { if(!open) { setIsDialogOpen(false); setEditingProduct(null); } }}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>{editingProduct && 'id' in editingProduct && editingProduct.id ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            {isDialogOpen && (
                <ProductForm 
                    product={editingProduct}
                    categories={categories}
                    onSave={handleSave} 
                    onCancel={() => { setIsDialogOpen(false); setEditingProduct(null); }} 
                />
            )}
        </DialogContent>
     </Dialog>
    </>
  );
}
