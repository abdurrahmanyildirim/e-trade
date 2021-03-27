export enum SortType {
  asc = 'asc',
  desc = 'desc',
  none = 'none'
}

export interface Filter {
  brands: any;
  sortType: SortType;
  category: string;
  sKey: string;
}
