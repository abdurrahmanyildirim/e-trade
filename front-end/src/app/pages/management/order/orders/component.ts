import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BasePageDirective } from 'src/app/pages/base-page.component';
import { PageSelector } from 'src/app/pages/model';
import { OrderList } from 'src/app/shared/models/order';
import { OrderService } from 'src/app/shared/services/rest/order.service';
import { StateService } from 'src/app/shared/services/site/state';
import { isPresent } from 'src/app/shared/util/common';
import { MnOrdersFactory } from './factory';
import { OrderStatus } from './model';
import { MnOrdersState } from './state';

@Component({
  selector: 'app-mn-orders',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  viewProviders: [MnOrdersFactory]
})
export class MnOrdersComponent
  extends BasePageDirective<MnOrdersState>
  implements OnInit, OnDestroy {
  orders: OrderList[];
  currentList: OrderList[];
  orderStatuses: OrderStatus[];
  subs = new Subscription();

  constructor(
    private orderService: OrderService,
    private router: Router,
    protected stateService: StateService,
    private mnOrdersFactory: MnOrdersFactory
  ) {
    super(stateService);
    this.selector = PageSelector.AppMnOrders;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.orderStatuses = this.mnOrdersFactory.createOrderStatusesList();
    this.initOrders();
  }

  initOrders(): void {
    const sub = this.orderService.getAllOrders().subscribe({
      next: (orderList) => {
        this.orders = orderList.sort(
          (a: OrderList, b: OrderList) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.initOrdersByStatus();
      },
      error: (err) => console.log(err)
    });
    this.subs.add(sub);
  }

  onSelectionChange(status: MatSelectChange): void {
    this.state.statusKey = status.value;
    this.saveState();
    this.initOrdersByStatus();
  }

  initOrdersByStatus(): void {
    this.currentList = this.orders
      .filter((order) => order.status[order.status.length - 1].key === this.state.statusKey)
      .slice();
  }

  navigateToDetail(id: string): void {
    this.router.navigateByUrl('management/order-detail/' + id);
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
