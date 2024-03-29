export interface Product {
  _id?: string;
  name: string;
  category: string;
  price: number;
  addedDate?: Date;
  description: any;
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
  orderId: string;
  userId: string;
  description: string;
  rate: number;
  date?: Date;
}

export interface CloudinaryPhoto {
  _id?: string;
  path: string;
  publicId: string;
}

export interface Category {
  _id?: string;
  name: string;
  isActive?: boolean;
}

export interface ProductInfo {
  id: string;
  isActive?: boolean;
  name?: string;
  hasEnoughStock?: boolean;
  availableQuantity?: number;
  quantity: number;
}
