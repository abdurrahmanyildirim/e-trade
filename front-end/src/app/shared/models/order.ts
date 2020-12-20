import { Category } from './product';

export interface Order {
    productId: string;
    brand: string;
    name: string;
    category: Category;
    price: number;
    discountRate: number;
    mainPhoto: string;
    quantity?: number;
}

