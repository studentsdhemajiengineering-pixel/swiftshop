
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
      <Button disabled className="h-9 w-20 rounded-lg border border-primary bg-primary/10 text-primary hover:bg-primary/20">
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
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => dispatch({ type: 'DECREMENT_QUANTITY', payload: { variationId: variation.id } })}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-bold text-lg">{itemInCart.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
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
        className="h-9 w-20 rounded-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground" 
        onClick={handleAddToCart}
    >
        ADD
    </Button>
  );
}
