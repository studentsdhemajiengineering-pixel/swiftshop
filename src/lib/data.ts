import type { Category, Product } from '@/lib/types';

export const categories: Category[] = [
  { id: 'fruits', name: 'Fruits', imageId: 'cat-fruits' },
  { id: 'vegetables', name: 'Vegetables', imageId: 'cat-vegetables' },
  { id: 'dairy', name: 'Dairy & Eggs', imageId: 'cat-dairy' },
  { id: 'bakery', name: 'Bakery', imageId: 'cat-bakery' },
  { id: 'meat', name: 'Meat & Poultry', imageId: 'cat-meat' },
  { id: 'pantry', name: 'Pantry', imageId: 'cat-pantry' },
  { id: 'snacks', name: 'Snacks', imageId: 'cat-snacks' },
];

export const allProducts: Product[] = [
  { id: '1', name: 'Apple', price: 2.5, imageId: 'apple', category: 'fruits', inventory: 100, unit: 'kg' },
  { id: '2', name: 'Banana', price: 1.8, imageId: 'banana', category: 'fruits', inventory: 150, unit: 'kg' },
  { id: '3', name: 'Artisan Bread', price: 4.5, imageId: 'bread', category: 'bakery', inventory: 50, unit: 'piece' },
  { id: '4', name: 'Whole Milk', price: 1.2, imageId: 'milk', category: 'dairy', inventory: 80, unit: 'liter' },
  { id: '5', name: 'Organic Eggs', price: 3.0, imageId: 'eggs', category: 'dairy', inventory: 60, unit: 'dozen' },
  { id: '6', name: 'Chicken Breast', price: 9.99, imageId: 'chicken', category: 'meat', inventory: 30, unit: 'kg' },
  { id: '7', name: 'Fresh Spinach', price: 2.0, imageId: 'spinach', category: 'vegetables', inventory: 75, unit: 'piece' },
  { id: '8', name: 'Vine Tomatoes', price: 3.5, imageId: 'tomatoes', category: 'vegetables', inventory: 90, unit: 'kg' },
  { id: '9', name: 'Cheddar Cheese', price: 5.5, imageId: 'cheese', category: 'dairy', inventory: 40, unit: 'piece' },
  { id: '10', name: 'Spaghetti', price: 1.5, imageId: 'pasta', category: 'pantry', inventory: 200, unit: 'piece' },
  { id: '11', name: 'Orange Juice', price: 3.2, imageId: 'orange-juice', category: 'pantry', inventory: 0, unit: 'liter' },
  { id: '12', name: 'Potato Chips', price: 2.8, imageId: 'potato-chips', category: 'snacks', inventory: 120, unit: 'piece' },
];

export const purchaseHistory = [
  'Apple',
  'Whole Milk',
  'Artisan Bread',
  'Organic Eggs',
  'Vine Tomatoes',
  'Potato Chips',
];
