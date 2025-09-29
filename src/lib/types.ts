
export type ProductVariation = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  inventory: number;
  unit: 'kg' | 'g' | 'piece' | 'liter' | 'ml' | 'dozen';
  deliveryTime?: string;
};

export type Product = {
  id: string;
  name: string;
  imageId: string;
  category: string;
  description: string;
  variations: ProductVariation[];
};

export type CartItem = {
  productId: string;
  variationId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  imageId: string;
  inventory: number;
};

export type Category = {
    id: string;
    name: string;
    imageId: string;
};

export type Promo = {
  id: string;
  name: string;
  imageId: string;
  href: string;
}

export type Order = {
    id: string;
    date: string;
    status: 'Preparing' | 'Out for Delivery' | 'Delivered';
    total: number;
    items: string[];
}
