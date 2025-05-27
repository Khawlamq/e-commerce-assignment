export interface Product {
  id: number;
  name: string;
  imageURL: string;
  price: number;
  description: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface CartResponse {
  cartItems: CartItem[];
  totalCost: number;
}