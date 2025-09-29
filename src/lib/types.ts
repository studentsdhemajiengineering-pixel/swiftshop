export type ProductVariation = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  inventory: number;
  unit: 'kg' | 'g' | 'piece' | 'liter' | 'ml' | 'dozen';
};

export type Product = {
  id: string;
  name: string;
  imageId: string;
  category: string;
  description: string;
  variations: ProductVariation[];
  deliveryTime?: string;
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
