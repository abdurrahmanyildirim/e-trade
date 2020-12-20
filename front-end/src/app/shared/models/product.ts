export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  discountRate: number;
  stockQuantity: number;
  mainPhoto: string;
  photos: string[];
  rate: number;
  comments: Comment[];
  brand: string;
}

export interface Comment {
  name: string;
  description: string;
  rate: number;
}

export enum Category {
  tava = 'tava',
  tencere = 'tencere',
  tabak = 'tabak'
}
