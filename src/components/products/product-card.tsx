
'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    <Card className="flex flex-col overflow-hidden h-full transition-shadow hover:shadow-lg relative">
      <Link href={`/product/${product.id}`} className="group flex flex-col h-full">
        {discount > 0 && (
           <div className="absolute top-0 left-0 z-10">
            <div className="relative">
              <svg width="60" height="32" viewBox="0 0 60 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M0 4C0 1.79086 1.79086 0 4 0H56C58.2091 0 60 1.79086 60 4V28C60 30.2091 58.2091 32 56 32H4C1.79086 32 0 30.2091 0 28V4Z" fill="currentColor"/>
                <path d="M60 28C48.9543 28 40 19.0457 40 8H56C58.2091 8 60 9.79086 60 12V28Z" fill="white" fillOpacity="0.2"/>
              </svg>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <p className="text-primary-foreground font-bold text-xs">{discount}% OFF</p>
              </div>
            </div>
          </div>
        )}
        <div className="p-2 pt-4">
          <div className="relative aspect-square w-full">
            {image ? (
              <Image
                src={image.imageUrl}
                alt={product.name}
                fill
                className="object-contain"
                data-ai-hint={image.imageHint}
              />
            ) : (
              <div className="w-full h-full bg-secondary" />
            )}
          </div>
        </div>
        <CardContent className="p-3 pt-2 flex-grow flex flex-col justify-between">
          <div>
            {defaultVariation.deliveryTime && (
              <div className="flex items-center text-xs text-muted-foreground mb-1">
                <Clock className="h-3 w-3 mr-1" />
                <span>{defaultVariation.deliveryTime}</span>
              </div>
            )}
            <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{defaultVariation.name}</p>
          </div>
          <div className="flex justify-between items-end mt-3">
            <div>
              <p className="font-bold text-lg">₹{defaultVariation.price.toFixed(2)}</p>
              {defaultVariation.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  ₹{defaultVariation.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <AddToCartButton product={product} variation={defaultVariation} />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
