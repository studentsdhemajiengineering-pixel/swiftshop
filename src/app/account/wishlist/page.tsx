'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProductGrid } from '@/components/products/product-grid';
import { getProducts } from '@/lib/firebase/service';
import type { Product } from '@/lib/types';
import { useEffect, useState } from 'react';

const WishlistHeader = () => {
    const router = useRouter();
    return (
        <header className="bg-background sticky top-0 z-40 border-b">
            <div className="container flex h-14 items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold flex-1">Wishlist</h1>
            </div>
        </header>
    );
};

export default function WishlistPage() {
    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            setLoading(true);
            const allProducts = await getProducts();
            // Mock wishlist logic: show first 4 products with discounts
            setWishlistProducts(allProducts.filter(p => p.variations.some(v => v.originalPrice)).slice(0, 4));
            setLoading(false);
        };
        fetchWishlist();
    }, []);

    return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
        <WishlistHeader />
        <main className="flex-1">
            <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            {loading ? (
                <p>Loading...</p>
            ) : wishlistProducts.length > 0 ? (
                <ProductGrid products={wishlistProducts} />
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                    <Heart className="h-20 w-20 text-muted-foreground/50 mb-4" />
                    <h2 className="text-xl font-bold">Your Wishlist is Empty</h2>
                    <p className="text-muted-foreground mt-2">Add items you love to your wishlist.</p>
                </div>
            )}
            </div>
        </main>
    </div>
    );
}
