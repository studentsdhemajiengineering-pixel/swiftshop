'use client';

import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { state, dispatch } = useCart();
  const { toast } = useToast();
  const itemInCart = state.cart.find((item) => item.id === product.id);

  if (product.inventory === 0) {
    return (
      <Button disabled variant="secondary" size="sm">
        Out of Stock
      </Button>
    );
  }

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast({
      title: 'Added to cart!',
      description: `${product.name} is now in your cart.`,
    });
  };

  if (itemInCart) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => dispatch({ type: 'DECREMENT_QUANTITY', payload: { id: product.id } })}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-bold w-4 text-center">{itemInCart.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => dispatch({ type: 'INCREMENT_QUANTITY', payload: { id: product.id } })}
          disabled={itemInCart.quantity >= product.inventory}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleAddToCart} size="sm">
      <Plus className="h-4 w-4 mr-1" />
      Add
    </Button>
  );
}
