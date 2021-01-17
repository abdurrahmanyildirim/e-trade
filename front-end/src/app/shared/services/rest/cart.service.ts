import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Contact } from 'src/app/pages/purchase-order/model';
import { Order } from '../../models/order';
import { StorageKey } from '../../models/storage';
import { isPresent } from '../../util/common';
import { ConfigService } from '../site/config.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnDestroy {
  subs = new Subscription();
  public cart = new BehaviorSubject<Order[]>([]);

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.initCart();
  }

  initCart(): void {
    if (this.authService.loggedIn()) {
      this.getCartFromDb().subscribe((cart) => {
        this.cart.next(cart);
      });
    } else {
      const orders = JSON.parse(window.localStorage.getItem(StorageKey.Cart)) || [];
      this.cart.next(orders);
    }
  }

  purchaseOrder(contactInfo: Contact): Observable<any> {
    return this.http.post(
      this.configService.config.domain + 'operation/purchase-order',
      contactInfo
    );
  }

  updateCart(orders: Order[]): void {
    if (this.authService.loggedIn()) {
      this.updateDbCart(orders).subscribe({
        next: (data) => {
          this.cart.next(orders);
        },
        error: (err) => console.log(err)
      });
    } else {
      this.updateLocaleStorage(orders);
      this.cart.next(orders);
    }
  }

  updateDbCart(orders: Order[]): Observable<Order[]> {
    return this.http.post<Order[]>(
      this.configService.config.domain + 'operation/update-cart',
      orders
    );
  }

  getCartFromDb(): Observable<Order[]> {
    return this.http.get<Order[]>(this.configService.config.domain + 'operation/cart');
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
