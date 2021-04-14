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
import { OrderList, OrderListProduct } from 'src/app/shared/models/order';
import { OrderService } from 'src/app/shared/services/rest/order.service';
import { StateService } from 'src/app/shared/services/site/state';
import { isPresent } from 'src/app/shared/util/common';
import { BasePageComponent } from '../base-page.component';
import { PageSelector } from '../model';
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
export class OrdersComponent extends BasePageComponent<OrdersState> implements OnInit, OnDestroy {
  filters: OrderFilter[];
  orderList: OrderList[];
  sub: Subscription;
  isMobile = false;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private ordersFactory: OrdersFactory,
    private cd: ChangeDetectorRef,
    protected stateService: StateService
  ) {
    super(stateService);
    this.selector = PageSelector.AppOrders;
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (document.body.clientWidth <= 650) {
      this.isMobile = true;
    }
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
      (sum: number, current: OrderListProduct) =>
        sum + current.quantity * (current.price - current.discountRate * current.price),
      0
    );
  }

  onSelectionChange(event: MatSelectChange): void {
    this.orderList = this.ordersFactory.filterOrders(event.value);
    this.state.filterKey = event.value;
    this.stateService.setState(this.selector, this.state);
  }

  navigateToDetail(id: string): void {
    this.router.navigateByUrl('order-detail/' + id);
  }

  ngOnDestroy(): void {
    if (isPresent(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
