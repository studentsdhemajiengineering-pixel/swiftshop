import type { Category, Product } from '@/lib/types';

export const categories: Category[] = [
  { id: 'vegetables-fruits', name: 'Vegetables & Fruits', imageId: 'cat-vegetables-fruits' },
  { id: 'atta-rice-dal', name: 'Atta, Rice & Dal', imageId: 'cat-atta-rice-dal' },
  { id: 'oil-ghee-masala', name: 'Oil, Ghee & Masala', imageId: 'cat-oil-ghee-masala' },
  { id: 'dairy-bread-eggs', name: 'Dairy, Bread & Eggs', imageId: 'cat-dairy-bread-eggs' },
  { id: 'bakery-biscuits', name: 'Bakery & Biscuits', imageId: 'cat-bakery-biscuits' },
  { id: 'dry-fruits-cereals', name: 'Dry Fruits & Cereals', imageId: 'cat-dry-fruits-cereals' },
  { id: 'chicken-meat-fish', name: 'Chicken, Meat & Fish', imageId: 'cat-chicken-meat-fish' },
  { id: 'kitchenware', name: 'Kitchenware', imageId: 'cat-kitchenware' },
];

export const allProducts: Product[] = [
  { id: '1', name: 'Fresh Vegetables', price: 5.99, imageId: 'product-fresh-vegetables', category: 'vegetables-fruits', inventory: 100, unit: 'kg' },
  { id: '2', name: 'Organic Atta', price: 8.50, imageId: 'product-organic-atta', category: 'atta-rice-dal', inventory: 150, unit: 'kg' },
  { id: '3', name: 'Sunflower Oil', price: 12.00, imageId: 'product-sunflower-oil', category: 'oil-ghee-masala', inventory: 50, unit: 'liter' },
  { id: '4', name: 'Fresh Milk', price: 3.20, imageId: 'product-fresh-milk', category: 'dairy-bread-eggs', inventory: 80, unit: 'liter' },
  { id: '5', name: 'Organic Eggs', price: 3.0, imageId: 'eggs', category: 'dairy-bread-eggs', inventory: 60, unit: 'dozen' },
  { id: '6', name: 'Chicken Breast', price: 9.99, imageId: 'chicken', category: 'chicken-meat-fish', inventory: 30, unit: 'kg' },
  { id: '7', name: 'Artisan Bread', price: 4.5, imageId: 'bread', category: 'bakery-biscuits', inventory: 50, unit: 'piece' },
];

export const purchaseHistory = [
  'Fresh Vegetables',
  'Fresh Milk',
  'Artisan Bread',
  'Organic Eggs',
];
