export interface OrderFilter {
  key: FilterKey;
  text: string;
}

export enum FilterKey {
  allOrders = 'allOrders',
  last30Days = 'last30Days',
  lastYear = 'lastYear'
}
