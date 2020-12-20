import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Order } from '../../models/order';
import { StorageKey } from '../../models/storage';
import { isPresent } from '../../util/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnDestroy {
  subs = new Subscription();
  public cart = new BehaviorSubject<Order[]>([]);

  constructor(private authService: AuthService) {
    this.initCartListener();
    this.initCart();
  }

  purchaseOrder(): void {
    // this
  }

  initCart(): void {
    if (this.authService.loggedIn()) {
      console.log('Veri tabanından dönen data');
    } else {
      const orders = JSON.parse(window.localStorage.getItem(StorageKey.Cart)) || [];
      this.cart.next(orders);
    }
  }

  initCartListener(): void {
    const subs = this.cart.subscribe({
      next: (orders) => {
        this.updateCart(orders);
      },
      error: (err) => console.log(err)
    });
    this.subs.add(subs);
  }

  updateCart(orders: Order[]): void {
    if (this.authService.loggedIn()) {
      console.log('Veri tabanına');
    } else {
      this.updateLocaleStorage(orders);
    }
  }

  updateLocaleStorage(orders: Order[]): void {
    window.localStorage.setItem(StorageKey.Cart, JSON.stringify(orders));
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
