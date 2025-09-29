
'use client';

import { useCart } from '@/hooks/use-cart';
import type { Product, ProductVariation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddToCartButtonProps {
  product: Product;
  variation: ProductVariation;
}

export function AddToCartButton({ product, variation }: AddToCartButtonProps) {
  const { state, dispatch } = useCart();
  const { toast } = useToast();
  const itemInCart = state.cart.find((item) => item.variationId === variation.id);

  if (variation.inventory === 0) {
    return (
      <Button disabled size="lg" className="w-full">
        Out of Stock
      </Button>
    );
  }

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variation } });
    toast({
      title: 'Added to cart!',
      description: `${product.name} - ${variation.name} is now in your cart.`,
    });
  };

  if (itemInCart) {
    return (
      <div className="flex items-center justify-between w-full rounded-full bg-primary text-primary-foreground h-12 px-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-primary-foreground rounded-full hover:bg-primary/80"
          onClick={() => dispatch({ type: 'DECREMENT_QUANTITY', payload: { variationId: variation.id } })}
        >
          <Minus className="h-5 w-5" />
        </Button>
        <span className="font-bold text-lg">{itemInCart.quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-primary-foreground rounded-full hover:bg-primary/80"
          onClick={() => dispatch({ type: 'INCREMENT_QUANTITY', payload: { variationId: variation.id } })}
          disabled={itemInCart.quantity >= variation.inventory}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <Button size="lg" className="w-full" onClick={handleAddToCart}>
        Add to Cart
    </Button>
  );
}
