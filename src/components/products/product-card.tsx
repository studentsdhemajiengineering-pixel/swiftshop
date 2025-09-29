
'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = PlaceHolderImages.find((p) => p.id === product.imageId);
  const defaultVariation = product.variations[0];
  const discount = defaultVariation.originalPrice
    ? Math.round(((defaultVariation.originalPrice - defaultVariation.price) / defaultVariation.originalPrice) * 100)
    : 0;

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-shadow hover:shadow-lg relative group">
       <Link href={`/product/${product.id}`} className="flex flex-col h-full">
        {discount > 0 && (
           <div className="absolute top-0 left-2 z-10">
            <div className="relative">
              <svg width="32" height="36" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary drop-shadow-md">
                <path d="M0 0H32V32.5L16 27L0 32.5V0Z" fill="currentColor"/>
              </svg>
              <div className="absolute top-0 left-0 w-full h-[32px] flex flex-col items-center justify-center">
                <p className="text-primary-foreground font-bold text-xs leading-none">{discount}%</p>
                <p className="text-primary-foreground font-bold text-[10px] leading-none">OFF</p>
              </div>
            </div>
          </div>
        )}
        <div className="p-1 bg-white">
          <div className="relative aspect-[4/3] w-full rounded-md overflow-hidden border">
            {image ? (
              <Image
                src={image.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
              />
            ) : (
              <div className="w-full h-full bg-secondary" />
            )}
          </div>
        </div>
        <CardContent className="p-2 flex-grow flex flex-col justify-between">
          <div>
            {defaultVariation.deliveryTime && (
              <div className="flex items-center text-xs text-muted-foreground mb-1 bg-secondary px-1.5 py-0.5 rounded-sm w-fit">
                <Clock className="h-3 w-3 mr-1" />
                <span>{defaultVariation.deliveryTime}</span>
              </div>
            )}
            <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{defaultVariation.name}</p>
          </div>
          <div className="mt-1 flex justify-between items-end">
            <div>
              <p className="font-bold text-base">₹{defaultVariation.price.toFixed(2)}</p>
              {defaultVariation.originalPrice && (
                <p className="text-xs text-muted-foreground line-through">
                  ₹{defaultVariation.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
            <div className="w-[70px]" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <AddToCartButton product={product} variation={defaultVariation} />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
