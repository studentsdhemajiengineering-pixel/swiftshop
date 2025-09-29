
'use client';

import { allProducts } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';

const ProductDetailHeader = () => {
    const router = useRouter();
    return (
        <header className="bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-40">
            <div className="container flex h-14 items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                 <div className="flex-1" />
                 <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
};


export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = allProducts.find((p) => p.id === params.id);
  const { dispatch } = useCart();

  if (!product) {
    notFound();
  }

  const image = PlaceHolderImages.find((p) => p.id === product.imageId);

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast({
      title: 'Added to cart!',
      description: `${product.name} is now in your cart.`,
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <ProductDetailHeader />
      <main className="flex-1 pt-14 pb-28">
        <div className="relative w-full aspect-square">
            {image && (
                <Image
                    src={image.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                    priority
                />
            )}
        </div>
        <div className="container mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
                <p className="mt-2 text-muted-foreground">
                    Fresh, creamy, and packed with nutrients, our organic {product.name.toLowerCase()}s are perfect for salads, smoothies, or simply enjoying on toast. Grown without pesticides, they're a healthy choice for you and the planet.
                </p>
            </div>

            <div>
                <h2 className="text-lg font-semibold">Price</h2>
                <p className="text-xl font-bold">${product.price.toFixed(2)} / {product.unit}</p>
            </div>

            <div>
                <h2 className="text-lg font-semibold">About</h2>
                <p className="text-muted-foreground">
                    Our organic {product.name.toLowerCase()}s are sourced from local farms committed to sustainable agriculture. They're hand-picked at peak ripeness to ensure the best flavor and texture.
                </p>
            </div>
        </div>
      </main>
       <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4 border-t">
         <div className="container mx-auto max-w-2xl px-0">
             <AddToCartButton product={product} />
         </div>
      </div>
    </div>
  );
}
