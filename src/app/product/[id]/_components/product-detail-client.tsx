
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { Product, ProductVariation } from '@/lib/types';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Header } from '@/components/layout/header';

const ProductDetailHeader = () => {
    const router = useRouter();
    return (
        <header className="bg-background/80 backdrop-blur-sm sticky top-0 left-0 right-0 z-40 md:hidden">
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

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(product?.variations[0]);
  const { state: cartState } = useCart();

  if (!selectedVariation) {
    return <div>Product variation not available.</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="hidden md:block">
        <Header />
      </div>
      <ProductDetailHeader />
      <main className="flex-1 pt-4 pb-20 md:py-10">
        <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 md:gap-12">
                 {/* Image Carousel */}
                <div className="p-4 md:p-0">
                <Carousel className="w-full max-w-xl mx-auto">
                    <CarouselContent>
                    {[product.imageUrl, product.imageUrl, product.imageUrl].map((url, index) => (
                        <CarouselItem key={index}>
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                            {url && (
                                <Image
                                    src={url}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            )}
                        </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                </Carousel>
                </div>

                {/* Product Details */}
                <div className="px-4 py-2 md:p-0 space-y-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{product.name}</h1>
                        <p className="mt-4 text-muted-foreground">
                        {product.description}
                        </p>
                    </div>
                    
                    <div>
                    <h2 className="text-lg font-semibold mb-3">Variations</h2>
                    <RadioGroup 
                        defaultValue={selectedVariation.id} 
                        className="grid grid-cols-3 gap-4"
                        onValueChange={(value) => setSelectedVariation(product.variations.find(v => v.id === value))}
                    >
                        {product.variations.map((variation) => (
                        <div key={variation.id}>
                            <RadioGroupItem value={variation.id} id={variation.id} className="sr-only" />
                            <Label htmlFor={variation.id} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <span className="font-semibold">{variation.name}</span>
                            <span className="text-sm">₹{variation.price.toFixed(2)}</span>
                            </Label>
                        </div>
                        ))}
                    </RadioGroup>
                    </div>

                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Price</h2>
                        <p className="text-2xl font-bold">₹{selectedVariation.price.toFixed(2)}</p>
                    </div>

                    <div className="space-y-4 pt-4">
                    <AddToCartButton product={product} variation={selectedVariation} />
                    {cartState.cart.length > 0 && (
                        <Button asChild className="w-full" size="lg">
                        <Link href="/checkout">Proceed to Checkout</Link>
                        </Button>
                    )}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
