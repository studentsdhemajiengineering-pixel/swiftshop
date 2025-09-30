
import type { Category, Product, Order } from '@/lib/types';
import allProductsData from './data/products.json';
import categoriesData from './data/categories.json';
import ordersData from './data/orders.json';

export const categories: Category[] = categoriesData;

export const allProducts: Product[] = allProductsData;

export const purchaseHistory = [
  'Fresh Vegetables',
  'Fresh Milk',
  'Artisan Bread',
  'Organic Eggs',
];

export const currentOrders: Order[] = ordersData.currentOrders;
export const deliveredOrders: Order[] = ordersData.deliveredOrders;
