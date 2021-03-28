import { Category } from './product';

export interface Order {
  productId: string;
  brand: string;
  name: string;
  category: string;
  price: number;
  discountRate: number;
  photo: string;
  quantity?: number;
}

export interface OrderList {
  _id: string;
  userId: string;
  date: string;
  products: OrderListProduct[];
  isActive: boolean;
  status: Status[];
  contactInfo: {
    city: string;
    district: string;
    address: string;
    phone: string;
  };
  totalPrice: number;
}

export interface OrderListProduct {
  productId: string;
  quantity: number;
  discountRate: number;
  price: number;
  photoPath: string;
}

export interface OrderDetail {
  _id: string;
  userId: string;
  date: string;
  products: OrderDetailProduct[];
  isActive: boolean;
  status: Status[];
  contactInfo: {
    city: string;
    district: string;
    address: string;
    phone: string;
  };
  totalPrice: number;
}

export interface Status {
  key: number;
  desc: string;
  date?: string;
}

export interface OrderDetailProduct {
  productId: string;
  quantity: number;
  discountRate: number;
  price: number;
  photoPath: string;
  brand: string;
  name: string;
  rate?: number;
}
