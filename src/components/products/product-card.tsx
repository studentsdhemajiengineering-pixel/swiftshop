import Image from 'next/image';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = PlaceHolderImages.find((p) => p.id === product.imageId);

  const getInventoryBadge = (inventory: number) => {
    if (inventory === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (inventory < 20) {
      return <Badge variant="secondary" className="bg-amber-500 text-white">Low Stock</Badge>;
    }
    return <Badge variant="secondary" className="bg-green-600 text-white">In Stock</Badge>;
  };

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full">
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
          <div className="absolute top-2 left-2">
            {getInventoryBadge(product.inventory)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-medium leading-tight mb-1">{product.name}</CardTitle>
        <p className="text-muted-foreground text-sm capitalize">{product.category}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <div className="font-semibold text-lg">
          ${product.price.toFixed(2)}
          <span className="text-sm text-muted-foreground"> / {product.unit}</span>
        </div>
        <AddToCartButton product={product} />
      </CardFooter>
    </Card>
  );
}
