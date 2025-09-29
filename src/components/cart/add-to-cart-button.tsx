
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
      <Button disabled className="w-full h-9 rounded-lg border border-muted bg-muted text-muted-foreground text-sm">
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
      <div className="flex items-center justify-between w-full h-9 rounded-lg border border-primary text-primary bg-primary/5">
        <Button
          variant="ghost"
          size="icon"
          className="h-full w-8 rounded-none text-primary"
          onClick={() => dispatch({ type: 'DECREMENT_QUANTITY', payload: { variationId: variation.id } })}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-bold text-sm">{itemInCart.quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-full w-8 rounded-none text-primary"
          onClick={() => dispatch({ type: 'INCREMENT_QUANTITY', payload: { variationId: variation.id } })}
          disabled={itemInCart.quantity >= variation.inventory}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button 
        variant="outline" 
        className="w-full h-9 rounded-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-sm" 
        onClick={handleAddToCart}
    >
        ADD
    </Button>
  );
}
