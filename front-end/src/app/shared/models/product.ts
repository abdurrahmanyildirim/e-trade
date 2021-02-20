export interface Product {
  _id?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  discountRate: number;
  stockQuantity: number;
  isActive?: boolean;
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
  _id?: string;
  path: string;
  publicId: string;
}

export interface Category {
  name: string;
}

// export enum Category {
//   tava = 'tava',
//   tencere = 'tencere',
//   tabak = 'tabak'
// }
