import { ESMap, Map } from 'typescript';

export interface SortType {
  key: string;
  text: string;
}

export enum SortTypes {
  asc = 'asc',
  desc = 'desc',
  none = 'none'
}

export interface Filter {
  brands: any;
  sortType: SortTypes;
}
