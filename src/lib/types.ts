export type Product = {
  id: string;
  name: string;
  price: number;
  imageId: string;
  category: string;
  inventory: number;
  unit: 'kg' | 'piece' | 'liter' | 'dozen';
};

export type Category = {
  id: string;
  name: string;
  imageId: string;
};

export type CartItem = Product & {
  quantity: number;
};
