export type ShoppingCart = {
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    images: string;
  }>;
};
