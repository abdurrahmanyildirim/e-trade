import { PageState } from 'src/app/shared/directives/base-component/state';
import { FilterKey } from './model';

export interface OrdersState extends PageState {
  filterKey: FilterKey;
}
