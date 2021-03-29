import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { Order } from 'src/app/shared/models/order';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { isPresent } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  orders: Order[];
  subs = new Subscription();
  quantityChange = new Subject<Order[]>();
  totalCost: number;
  cartStepActive = true;
  @ViewChild('stepper') stepper: MatStepper;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.initOrders();
    this.initQuantityChange();
  }

  initOrders(): void {
    this.cartService.cart.subscribe({
      next: (orders) => {
        this.orders = orders;
        this.calculateTotalCost();
      }
    });
  }

  toggleStepper(): void {
    if (this.cartStepActive) {
      this.stepper.next();
      this.cartStepActive = false;
    } else {
      this.stepper.previous();
      this.cartStepActive = true;
    }
  }

  initQuantityChange(): void {
    const sub = this.quantityChange.pipe(throttleTime(500)).subscribe({
      next: (orders) => {
        this.cartService.updateCart(orders);
        this.calculateTotalCost();
      },
      error: (err) => console.log(err)
    });
    this.subs.add(sub);
  }

  onOrderListChange(orders: Order[]): void {
    this.quantityChange.next(orders);
  }

  calculateTotalCost(): void {
    let cost = 0;
    this.orders.forEach((order) => {
      cost += (order.price - order.price * order.discountRate) * order.quantity;
    });
    this.totalCost = cost;
  }

  changeStatus(): void {
    this.router.navigateByUrl('purchase-order');
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
