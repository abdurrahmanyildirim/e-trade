import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { isPresent } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PurchaseOrderComponent implements OnInit, OnDestroy {
  orderStatus = -1;
  orders = [];
  totalCost = 0;
  orderSub: Subscription;
  timerSub: Subscription;

  constructor(private cartService: CartService, private router: Router) {
    if (this.cartService.cart.value.length <= 0) {
      this.router.navigateByUrl('cart');
    }
    // this.orders = this.cartService.cart.value;
  }

  ngOnInit(): void {
    this.listenCart();
  }

  listenCart(): void {
    this.cartService.cart.subscribe({
      next: (orders) => {
        this.orders = orders;
        this.calculateTotalCost();
      },
      error: (err) => console.log(err)
    });
  }

  calculateTotalCost(): void {
    let cost = 0;
    this.orders.forEach((order) => {
      cost += order.price * order.quantity * order.discountRate;
    });
    this.totalCost = cost;
  }

  purchaseOrder(): void {
    this.orderStatus = 0;
    this.timerSub = timer(5000).subscribe({
      next: () => {
        this.orderSub = this.cartService.purchaseOrder().subscribe({
          next: (response) => {
            this.orderStatus = 1;
            this.cartService.initCart();
          },
          error: (err) => {
            this.orderStatus = 2;
          }
        });
      }
    });
  }

  navigateToCart(): void {
    this.router.navigateByUrl('cart');
  }

  ngOnDestroy(): void {
    if (isPresent(this.orderSub)) {
      this.orderSub.unsubscribe();
    }
    if (isPresent(this.timerSub)) {
      this.timerSub.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
