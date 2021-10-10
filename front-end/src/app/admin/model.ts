export enum PageSelector {
  AppOrders = 'app-orders',
  AppMnProducts = 'app-mn-products',
  AppMnOrders = 'app-mn-orders'
}

export interface RouteCategory {
  key: string;
  title: string;
  isActive: boolean;
}
