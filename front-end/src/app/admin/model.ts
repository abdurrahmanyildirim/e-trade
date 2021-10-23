export enum PageSelector {
  AppAdminProducts = 'app-admin-products',
  AppAdminOrders = 'app-admin-orders'
}

export interface RouteCategory {
  key: string;
  title: string;
  isActive: boolean;
}
