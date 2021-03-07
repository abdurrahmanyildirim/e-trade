import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderList, OrderListProduct } from 'src/app/shared/models/order';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { OrderService } from 'src/app/shared/services/rest/order.service';
import { isPresent } from 'src/app/shared/util/common';

@Component({
  selector: 'app-orders',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  providers: [OrderService]
})
export class OrdersComponent implements OnInit, OnDestroy {
  orderListType = [
    {
      key: 'allOrders',
      text: 'Tüm Siparişler'
    },
    {
      key: 'lastMonth',
      text: 'Son Ay'
    },
    {
      key: 'previousYear',
      text: (new Date().getFullYear() - 1).toString()
    }
  ];
  currentList: any = this.orderListType[0];
  orderList: any[];
  currentUser: User;
  sub: Subscription;
  isMobile = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (document.body.clientWidth <= 650) {
      this.isMobile = true;
    }
    this.currentUser = this.authService.currentUser.value;
    this.initOrders();
  }

  initOrders(): void {
    this.sub = this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orderList = orders
          .sort(
            (a: OrderList, b: OrderList) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((order: any) => {
            order.totalPrice = this.calculateTotalPrice(order);
            return order;
          });
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

  navigateToDetail(id: string): void {
    this.router.navigateByUrl('order-detail/' + id);
  }

  ngOnDestroy(): void {
    if (isPresent(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
