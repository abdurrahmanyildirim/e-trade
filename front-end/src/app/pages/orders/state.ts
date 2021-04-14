import { PageState } from '../state';
import { FilterKey } from './model';

export interface OrdersState extends PageState {
  filterKey: FilterKey;
}
