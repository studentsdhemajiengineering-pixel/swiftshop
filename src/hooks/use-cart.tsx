
'use client';

import type { CartItem, Product, ProductVariation } from '@/lib/types';
import React, { createContext, useContext, useReducer, type ReactNode, useEffect, useState } from 'react';

type CartState = {
  cart: CartItem[];
  hydrated: boolean;
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; variation: ProductVariation } }
  | { type: 'REMOVE_ITEM'; payload: { variationId: string } }
  | { type: 'INCREMENT_QUANTITY'; payload: { variationId: string } }
  | { type: 'DECREMENT_QUANTITY'; payload: { variationId: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_STATE'; payload: CartState }
  | { type: 'HYDRATE_CART'; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);


const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'HYDRATE_CART':
      return { ...action.payload, hydrated: true };
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
          imageUrl: product.imageUrl,
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

const initialState: CartState = { cart: [], hydrated: false };


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem('cart');
        if (item) {
            dispatch({ type: 'HYDRATE_CART', payload: JSON.parse(item) });
        } else {
            dispatch({ type: 'HYDRATE_CART', payload: { cart: [] } });
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage', error);
      dispatch({ type: 'HYDRATE_CART', payload: { cart: [] } });
    }
  }, []);

  useEffect(() => {
    if (state.hydrated) {
        try {
            const stateToPersist = { cart: state.cart };
            window.localStorage.setItem('cart', JSON.stringify(stateToPersist));
        } catch (error) {
            console.error('Error writing to localStorage', error);
        }
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
