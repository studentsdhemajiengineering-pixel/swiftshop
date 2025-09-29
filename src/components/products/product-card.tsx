
'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = PlaceHolderImages.find((p) => p.id === product.imageId);
  const defaultVariation = product.variations[0];

  return (
    <Link href={`/product/${product.id}`} className="group">
      <Card className="flex flex-col overflow-hidden h-full transition-shadow hover:shadow-lg">
        <div className="p-2">
          <div className="relative aspect-square w-full">
            {image ? (
              <Image
                src={image.imageUrl}
                alt={product.name}
                fill
                className="object-cover rounded-md"
                data-ai-hint={image.imageHint}
              />
            ) : (
              <div className="w-full h-full bg-secondary" />
            )}
          </div>
        </div>
        <CardContent className="p-3 pt-0 flex-grow flex flex-col">
          <h3 className="text-sm font-medium leading-tight mb-2 flex-grow group-hover:text-primary">
            {product.name}
          </h3>
          <div className="flex justify-between items-center">
            <div className="font-semibold text-base">
              ₹{defaultVariation.price.toFixed(2)}
            </div>
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <AddToCartButton product={product} variation={defaultVariation} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
