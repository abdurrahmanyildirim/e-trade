import { Injectable } from '@angular/core';
import { OrderList } from 'src/app/shared/models/order';
import { FilterKey, OrderFilter } from './model';

@Injectable()
export class OrdersFactory {
  orderList: OrderList[];
  filterOrders(key: FilterKey): OrderList[] {
    switch (key) {
      case FilterKey.allOrders:
        return this.orderList.slice();
      case FilterKey.last30Days:
        return this.last30Days();
      case FilterKey.lastYear:
        return this.lastYear();
      default:
        return this.orderList.slice();
    }
  }

  createOrderFilters(): OrderFilter[] {
    return [
      {
        key: FilterKey.allOrders,
        text: 'Tüm Siparişler'
      },
      {
        key: FilterKey.last30Days,
        text: 'Son 30 Gün'
      },
      {
        key: FilterKey.lastYear,
        text: (new Date().getFullYear() - 1).toString()
      }
    ];
  }

  private last30Days(): OrderList[] {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
    return this.orderList.slice().filter((order) => new Date(order.date) > thirtyDaysAgo);
  }

  private lastYear(): OrderList[] {
    return this.orderList.filter(
      (order) => new Date(order.date).getFullYear() === new Date().getFullYear() - 1
    );
  }
}
