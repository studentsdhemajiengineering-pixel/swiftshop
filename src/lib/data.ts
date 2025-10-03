

import type { Order, Product } from '@/lib/types';
import ordersData from './data/orders.json';
import productsData from './data/products.json';

export const purchaseHistory = [
  'Fresh Vegetables',
  'Fresh Milk',
  'Artisan Bread',
  'Organic Eggs',
];

export const allProducts: Product[] = productsData.map(p => ({
  ...p,
  variations: p.variations.map(v => ({...v, id: v.id || `${p.id}-${v.name}`}))
}));
