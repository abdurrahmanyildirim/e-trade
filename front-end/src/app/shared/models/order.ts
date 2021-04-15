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
  email: string;
  userName: string;
  contactInfo: {
    city: string;
    district: string;
    address: string;
    phone: string;
  };
  totalPrice: number;
}

export interface OrderListProduct {
  name: string;
  productId: string;
  quantity: number;
  discountRate: number;
  price: number;
  photoPath: string;
  brand: string;
  rate?: number;
}

export interface Status {
  key: number;
  desc: string;
  date?: string;
}

export enum Statuses {
  Canceled = -1,
  Received = 0,
  Preparing = 1,
  Cargo = 2,
  Delivered = 3
}
