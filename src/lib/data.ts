
import type { Order } from '@/lib/types';
import ordersData from './data/orders.json';

export const purchaseHistory = [
  'Fresh Vegetables',
  'Fresh Milk',
  'Artisan Bread',
  'Organic Eggs',
];

export const currentOrders: Order[] = ordersData.currentOrders;
export const deliveredOrders: Order[] = ordersData.deliveredOrders;
