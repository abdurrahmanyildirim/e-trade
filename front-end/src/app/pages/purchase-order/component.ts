import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { CartService } from 'src/app/shared/services/rest/cart.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PurchaseOrderComponent implements OnInit {
  orderStatus = -1;
  orders = [];
  totalCost = 0;

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
    timer(1000).subscribe(() => {
      if (true) {
        this.orderStatus = 1;
      } else {
        this.orderStatus = 2;
      }
    });
  }

  navigateToCart(): void {
    this.router.navigateByUrl('cart');
  }
}
