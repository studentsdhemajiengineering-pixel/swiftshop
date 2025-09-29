
'use client';

import type { CartItem, Product, ProductVariation } from '@/lib/types';
import React, { createContext, useContext, useReducer, type ReactNode, useEffect } from 'react';

type CartState = {
  cart: CartItem[];
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; variation: ProductVariation } }
  | { type: 'REMOVE_ITEM'; payload: { variationId: string } }
  | { type: 'INCREMENT_QUANTITY'; payload: { variationId: string } }
  | { type: 'DECREMENT_QUANTITY'; payload: { variationId: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_STATE'; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);


const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_STATE':
        return action.payload;
    case 'ADD_ITEM': {
      const { product, variation } = action.payload;
      const existingItem = state.cart.find((item) => item.variationId === variation.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.variationId === variation.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      const newItem: CartItem = {
          productId: product.id,
          variationId: variation.id,
          name: `${product.name} - ${variation.name}`,
          price: variation.price,
          unit: variation.unit,
          quantity: 1,
          imageId: product.imageId,
          inventory: variation.inventory
      }
      return {
        ...state,
        cart: [...state.cart, newItem],
      };
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        cart: state.cart.filter((item) => item.variationId !== action.payload.variationId),
      };
    }
    case 'INCREMENT_QUANTITY': {
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.variationId === action.payload.variationId
            ? { ...item, quantity: Math.min(item.quantity + 1, item.inventory) }
            : item
        ),
      };
    }
    case 'DECREMENT_QUANTITY': {
      const itemToDecrement = state.cart.find(item => item.variationId === action.payload.variationId);
      if (itemToDecrement && itemToDecrement.quantity > 1) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.variationId === action.payload.variationId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        };
      }
      // If quantity is 1, remove the item
      return {
        ...state,
        cart: state.cart.filter((item) => item.variationId !== action.payload.variationId),
      };
    }
    case 'CLEAR_CART': {
        return {
            ...state,
            cart: []
        };
    }
    default:
      return state;
  }
};

const getInitialState = (): CartState => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem('cart');
        return item ? JSON.parse(item) : { cart: [] };
      }
    } catch (error) {
      console.error('Error reading from localStorage', error);
    }
    return { cart: [] };
}


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, getInitialState());

  useEffect(() => {
    try {
        window.localStorage.setItem('cart', JSON.stringify(state));
    } catch (error) {
        console.error('Error writing to localStorage', error);
    }
  }, [state]);

  // This effect listens for storage changes from other tabs.
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'cart' && e.newValue) {
            try {
                dispatch({ type: 'SET_STATE', payload: JSON.parse(e.newValue) });
            } catch (error) {
                console.error('Error parsing cart from localStorage', error);
            }
        }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
