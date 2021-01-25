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
  date: string;
}

export interface OrderDetailProduct {
  productId: string;
  quantity: number;
  discountRate: number;
  price: number;
  photoPath: string;
  brand: string;
  name: string;
}
