import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderList } from 'src/app/pages/orders/model';
import { Order } from 'src/app/shared/models/order';
import { OrderService } from 'src/app/shared/services/rest/order.service';
import { isPresent } from 'src/app/shared/util/common';
import { Status } from './model';

@Component({
  selector: 'app-mn-orders',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class MnOrdersComponent implements OnInit, OnDestroy {
  orders: OrderList[];
  currentList: OrderList[];
  orderTypes = [
    {
      key: -1,
      desc: 'İptal Edilenler'
    },
    {
      key: 0,
      desc: 'Yeni Siparişler'
    },
    {
      key: 1,
      desc: 'İşleme Alınanlar'
    },
    {
      key: 2,
      desc: 'Kargoya Verilenler'
    },
    {
      key: 3,
      desc: 'Teslim Edilenler'
    }
  ] as any;
  currentType = Object.assign({}, this.orderTypes[1]);
  statuses: Status[];
  subs = new Subscription();
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.initStatuses();
    this.initOrders();
  }

  initOrders(): void {
    const sub = this.orderService.getAllOrders().subscribe({
      next: (orderList) => {
        this.orders = orderList;
        this.initCurrentOrderList();
      },
      error: (err) => console.log(err)
    });
    this.subs.add(sub);
  }

  initCurrentOrderList(): void {
    console.log(this.currentType);
    console.log(this.orders);
    this.currentList = this.orders
      .filter((order) => order.status[order.status.length - 1].key === this.currentType.key)
      .slice();
  }

  initStatuses(): void {
    const sub = this.orderService.getStatuses().subscribe({
      next: (statuses) => {
        this.statuses = statuses;
        // this.currentStatus = statuses.find((status) => status.key === 0);
      },
      error: (err) => console.log(err)
    });
    this.subs.add(sub);
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
