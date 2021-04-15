export enum SortType {
  asc = 'asc',
  desc = 'desc',
  none = ''
}

export interface Filter {
  brands: string;
  sortType: SortType;
  category: string;
  searchKey: string;
}
