import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageSelector } from 'src/app/pages/model';
import { OrderList } from 'src/app/shared/models/order';
import { OrderService } from 'src/app/shared/services/rest/order/service';
import { StateService } from 'src/app/shared/services/site/state';
import { isPresent } from 'src/app/shared/util/common';
import { BaseAdminDirective } from '../base-admin.directive';
import { RouteCategory } from '../model';
import { AdminService } from '../service';
import { OrdersFactory } from './factory';
import { OrdersState } from './state';

@Component({
  selector: 'app-orders',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  viewProviders: [OrdersFactory],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent extends BaseAdminDirective<OrdersState> implements OnInit, OnDestroy {
  orders: OrderList[];
  currentList: OrderList[];
  subs = new Subscription();

  constructor(
    private orderService: OrderService,
    private router: Router,
    protected stateService: StateService,
    private ordersFactory: OrdersFactory,
    private cd: ChangeDetectorRef,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute
  ) {
    super(stateService);
    this.selector = PageSelector.AppMnOrders;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initCategories();
    this.initOrders();
    this.listenRoute();
  }

  initCategories(): void {
    const categories = this.ordersFactory.createOrderStatusesList().map((category) => {
      return {
        key: category.key.toString(),
        title: category.desc,
        isActive: category.key === parseFloat(this.state.statusKey)
      };
    }) as RouteCategory[];
    this.adminService.routeInfo.next(categories);
  }

  listenRoute(): void {
    const subs = this.activatedRoute.queryParams.subscribe((params) => {
      // tslint:disable-next-line: no-string-literal
      const key = params['key'];
      if (isPresent(key) && key !== this.state.statusKey) {
        this.state.statusKey = key;
        this.saveState();
        this.initOrdersByStatus();
      }
    });
    this.subs.add(subs);
  }

  initOrders(): void {
    const sub = this.orderService.getAll().subscribe({
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

  initOrdersByStatus(): void {
    const statusKey = parseFloat(this.state.statusKey);
    this.currentList = this.orders
      .filter((order) => order.status[order.status.length - 1].key === statusKey)
      .slice();
    this.cd.detectChanges();
  }

  navigateToDetail(id: string): void {
    this.router.navigateByUrl('admin/order-detail/' + id);
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    super.ngOnDestroy();
  }
}
