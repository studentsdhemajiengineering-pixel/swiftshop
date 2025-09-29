'use client';

import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
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
      <Button disabled variant="outline" size="icon" className="h-8 w-8 bg-muted">
        <ShoppingCart className="h-4 w-4" />
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
      <div className="flex items-center gap-1 rounded-full bg-primary/10">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-primary rounded-full"
          onClick={() => dispatch({ type: 'DECREMENT_QUANTITY', payload: { id: product.id } })}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-bold w-4 text-center text-primary text-sm">{itemInCart.quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-primary rounded-full"
          onClick={() => dispatch({ type: 'INCREMENT_QUANTITY', payload: { id: product.id } })}
          disabled={itemInCart.quantity >= product.inventory}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="icon" className="h-8 w-8 bg-primary/10 border-primary/20 text-primary" onClick={handleAddToCart}>
        <ShoppingCart className="h-4 w-4" />
    </Button>
  );
}
