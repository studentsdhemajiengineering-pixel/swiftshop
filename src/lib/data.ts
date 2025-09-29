
import type { Category, Product, Order } from '@/lib/types';

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
  { 
    id: '1', 
    name: 'Fresh Vegetables', 
    imageId: 'product-fresh-vegetables', 
    category: 'vegetables-fruits', 
    description: 'A mix of fresh, seasonal vegetables, perfect for a healthy meal. Sourced from local farms to ensure the best quality and taste.',
    variations: [
      { id: '1-500g', name: '500g', price: 49, originalPrice: 65, inventory: 100, unit: 'g', deliveryTime: '8 MINS' },
      { id: '1-1kg', name: '1kg', price: 89, originalPrice: 110, inventory: 100, unit: 'kg', deliveryTime: '8 MINS' },
    ]
  },
  { 
    id: '2', 
    name: 'Organic Atta', 
    imageId: 'product-organic-atta', 
    category: 'atta-rice-dal',
    description: 'Whole wheat flour, organically grown and stone-ground to preserve its natural goodness. Ideal for making soft rotis and chapatis.',
    variations: [
      { id: '2-1kg', name: '1kg', price: 110, inventory: 150, unit: 'kg', deliveryTime: '15 MINS' },
      { id: '2-5kg', name: '5kg', price: 520, originalPrice: 550, inventory: 50, unit: 'kg', deliveryTime: '15 MINS' },
    ]
  },
  { 
    id: '3', 
    name: 'Sunflower Oil', 
    imageId: 'product-sunflower-oil', 
    category: 'oil-ghee-masala',
    description: 'Light and healthy sunflower oil, perfect for all your cooking needs. Rich in Vitamin E and low in saturated fats.',
    variations: [
      { id: '3-1l', name: '1L', price: 181, originalPrice: 250, inventory: 50, unit: 'liter', deliveryTime: '8 MINS' },
    ]
  },
  { 
    id: '4', 
    name: 'Fresh Milk', 
    imageId: 'product-fresh-milk', 
    category: 'dairy-bread-eggs',
    description: 'Creamy and delicious full-cream milk, sourced from pasture-raised cows. Perfect for your morning coffee or cereal.',
    variations: [
      { id: '4-500ml', name: '500ml', price: 30, inventory: 80, unit: 'ml', deliveryTime: '5 MINS' },
      { id: '4-1l', name: '1L', price: 57, originalPrice: 75, inventory: 80, unit: 'liter', deliveryTime: '5 MINS' },
    ]
  },
  { 
    id: '5', 
    name: 'Organic Eggs', 
    imageId: 'eggs', 
    category: 'dairy-bread-eggs',
    description: 'Farm-fresh organic eggs, laid by free-range hens. A great source of protein to start your day.',
    variations: [
      { id: '5-6pc', name: '6 pieces', price: 70, inventory: 60, unit: 'piece', deliveryTime: '10 MINS' },
      { id: '5-12pc', name: '12 pieces', price: 130, originalPrice: 150, inventory: 60, unit: 'dozen', deliveryTime: '10 MINS' },
    ]
  },
  { 
    id: '6', 
    name: 'Chicken Breast', 
    imageId: 'chicken', 
    category: 'chicken-meat-fish',
    description: 'Tender, boneless, and skinless chicken breast. A lean source of protein for a variety of dishes.',
    variations: [
      { id: '6-1kg', name: '1kg', price: 450, inventory: 30, unit: 'kg', deliveryTime: '20 MINS' },
    ]
  },
  { 
    id: '7', 
    name: 'Artisan Bread', 
    imageId: 'bread', 
    category: 'bakery-biscuits',
    description: 'A crusty loaf of artisan-style bread, baked fresh daily. Perfect for sandwiches or enjoying with soup.',
    variations: [
      { id: '7-1pc', name: '1 piece', price: 90, inventory: 50, unit: 'piece', deliveryTime: '30 MINS' },
    ]
  },
];

export const purchaseHistory = [
  'Fresh Vegetables',
  'Fresh Milk',
  'Artisan Bread',
  'Organic Eggs',
];

export const currentOrders: Order[] = [
    {
      id: 'SW12345',
      date: '2024-07-29T16:30:00Z',
      status: 'Out for Delivery',
      total: 549.50,
      items: allProducts.slice(0, 3).map(p => p.name)
    },
    {
      id: 'SW12344',
      date: '2024-07-29T15:10:00Z',
      status: 'Preparing',
      total: 210.00,
      items: allProducts.slice(3, 5).map(p => p.name)
    }
];

export const deliveredOrders: Order[] = [
    {
      id: 'SW12341',
      date: '2024-07-28T18:05:00Z',
      status: 'Delivered',
      total: 1190.00,
      items: allProducts.slice(1, 4).map(p => p.name)
    },
     {
      id: 'SW12339',
      date: '2024-07-27T12:45:00Z',
      status: 'Delivered',
      total: 78.00,
      items: allProducts.slice(5, 6).map(p => p.name)
    }
];
