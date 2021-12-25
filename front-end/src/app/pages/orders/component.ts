import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BasePageDirective } from 'src/app/shared/directives/base-component/base-page.component';
import { PageSelector } from 'src/app/shared/directives/base-component/model';
import { OrderList, OrderListProduct } from 'src/app/shared/models/order';
import { OrderService } from 'src/app/shared/services/rest/order/service';
import { MobileDetectionService } from 'src/app/shared/services/site/mobile-detection';
import { StateService } from 'src/app/shared/services/site/state';
import { isPresent } from 'src/app/shared/util/common';
// import { BasePageDirective } from '../base-page.component';
import { OrdersFactory } from './factory';
import { OrderFilter } from './model';
import { OrdersState } from './state';

@Component({
  selector: 'app-orders',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  viewProviders: [OrdersFactory],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent extends BasePageDirective<OrdersState> implements OnInit, OnDestroy {
  filters: OrderFilter[];
  orderList: OrderList[];
  sub: Subscription;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private ordersFactory: OrdersFactory,
    private cd: ChangeDetectorRef,
    protected stateService: StateService,
    public mobileDet: MobileDetectionService
  ) {
    super(stateService);
    this.selector = PageSelector.AppOrders;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.filters = this.ordersFactory.createOrderFilters();
    this.initOrders();
  }

  initOrders(): void {
    this.sub = this.orderService
      .getOrders()
      .pipe(
        map((orders) => {
          return orders
            .sort(
              (a: OrderList, b: OrderList) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((order) => {
              order.totalPrice = this.calculateTotalPrice(order);
              return order;
            });
        })
      )
      .subscribe({
        next: (orders) => {
          this.ordersFactory.orderList = orders;
          this.orderList = this.ordersFactory.filterOrders(this.state.filterKey);
          this.cd.detectChanges();
        },
        error: (err) => console.log(err)
      });
  }

  calculateTotalPrice(order: OrderList): number {
    return order.products.reduce(
      (sum: number, cur: OrderListProduct) =>
        sum + cur.quantity * (cur.price - cur.discountRate * cur.price),
      0
    );
  }

  onSelectionChange(event: MatSelectChange): void {
    this.state.filterKey = event.value;
    this.saveState();
    this.orderList = this.ordersFactory.filterOrders(this.state.filterKey);
  }

  navigateToDetail(id: string): void {
    this.router.navigateByUrl('order-detail/' + id);
  }

  ngOnDestroy(): void {
    if (isPresent(this.sub)) {
      this.sub.unsubscribe();
    }
    super.ngOnDestroy();
  }
}
