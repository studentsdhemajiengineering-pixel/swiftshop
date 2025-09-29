
'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
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
    <div className="group relative border rounded-lg overflow-hidden transition-shadow hover:shadow-md h-full flex flex-col">
       <Link href={`/product/${product.id}`} className="block flex-grow">
          <div className="relative w-full aspect-[4/3] p-4">
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
            {discount > 0 && (
                <Badge variant="destructive" className="absolute top-2 left-2 z-10">{discount}% OFF</Badge>
            )}
          </div>
          <div className="p-3 pt-0">
            {product.deliveryTime && (
                 <div className="flex items-center text-xs text-muted-foreground mb-1">
                    <Clock className="w-3 h-3 mr-1"/>
                    <span>{product.deliveryTime}</span>
                </div>
            )}
            <h3 className="text-sm font-normal leading-tight mb-1 h-10 overflow-hidden">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{defaultVariation.name}</p>
          </div>
       </Link>
       <div className="p-3 pt-0 mt-auto flex justify-between items-center">
            <div>
                <p className="font-semibold text-base">
                ₹{defaultVariation.price.toFixed(2)}
                </p>
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
    </div>
  );
}
