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

export interface Status {
  key: number;
  desc: string;
  date: string;
}

export interface OrderListProduct {
  productId: string;
  quantity: number;
  discountRate: number;
  price: number;
  photoPath: string;
}

