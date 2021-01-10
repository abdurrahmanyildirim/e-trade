export interface Product {
  _id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  discountRate: number;
  stockQuantity: number;
  photos: CloudinaryPhoto[];
  rate: number;
  comments: Comment[];
  brand: string;
}

export interface Comment {
  _id: string;
  name: string;
  description: string;
  rate: number;
}

export interface CloudinaryPhoto {
  _id: string;
  path: string;
  publicId: string;
}

export enum Category {
  tava = 'tava',
  tencere = 'tencere',
  tabak = 'tabak'
}
