
'use server';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { getProducts } from "@/lib/firebase/service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default async function AdminProductsPage() {
    const allProducts = await getProducts();
    
  return (
    <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Manage your products and view their sales performance.</CardDescription>
                </div>
                <Button>
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
                        <TableHead>Total Sales</TableHead>
                        <TableHead>
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allProducts.map(product => {
                         const image = PlaceHolderImages.find((p) => p.id === product.imageId);
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
                                    <Badge variant={product.variations.some(v => v.inventory > 0) ? "default" : "destructive"}>
                                        {product.variations.some(v => v.inventory > 0) ? 'In Stock' : 'Out of Stock'}
                                    </Badge>
                                </TableCell>
                                <TableCell>₹{product.variations[0].price.toFixed(2)}</TableCell>
                                <TableCell>25</TableCell>
                                <TableCell>
                                     <Button variant="outline" size="sm">Edit</Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
