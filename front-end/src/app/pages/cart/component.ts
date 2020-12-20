import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Order } from 'src/app/shared/models/order';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { isPresent } from 'src/app/shared/util/common';
import { SlideInOutAnimation } from './animations';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  animations: [SlideInOutAnimation]
})
export class CartComponent implements OnInit, OnDestroy {
  orders: Order[];
  sub: Subscription;
  quantityChange = new Subject<Order[]>();
  totalCost: number;

  constructor(private cartService: CartService, private router: Router) {
    this.orders = this.cartService.cart.value;
  }

  ngOnInit(): void {
    this.initQuantityChange();
    this.calculateTotalCost();
  }

  initQuantityChange(): void {
    this.sub = this.quantityChange.pipe(debounceTime(500)).subscribe({
      next: (orders) => {
        this.cartService.cart.next(orders);
        this.calculateTotalCost();
        this.orders = orders;
      },
      error: (err) => console.log(err)
    });
  }

  onOrderListChange(orders: Order[]): void {
    this.quantityChange.next(orders);
  }

  calculateTotalCost(): void {
    let cost = 0;
    this.orders.forEach((order) => {
      cost += order.price * order.quantity * order.discountRate;
    });
    this.totalCost = cost;
  }

  changeStatus(): void {
    this.router.navigateByUrl('purchase-order');
  }

  ngOnDestroy(): void {
    if (isPresent(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
