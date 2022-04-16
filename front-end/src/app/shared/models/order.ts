export interface Order {
  productId: string;
  brand: string;
  name: string;
  category: string;
  price: number;
  discountRate: number;
  photoPath: string;
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
  cargo: Cargo;
}

export interface OrderListProduct {
  name: string;
  productId: string;
  quantity: number;
  discountRate: number;
  price: number;
  photoPath: string;
  brand: string;
  comment: {
    rate?: number;
    desc?: string;
  };
  cargo: Cargo;
}

export interface Status {
  key: number;
  desc: string;
  date?: string;
}

export interface Cargo {
  no: string;
  company: string;
}

export enum Statuses {
  Canceled = -1,
  Received = 0,
  Preparing = 1,
  Cargo = 2,
  Delivered = 3
}
