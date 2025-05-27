export interface Product {
  id: number;
  name: string;
  imageURL: string | null; 
  price: number;
  description: string | null; 
  categoryId: number;
}
