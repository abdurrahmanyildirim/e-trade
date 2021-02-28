import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Contact } from 'src/app/pages/cart/purchase-order/model';
import { Order } from '../../models/order';
import { StorageKey } from '../../models/storage';
import { isPresent } from '../../util/common';
import { ConfigService } from '../site/config.service';
import { LocalStorageService } from '../site/local-storage.service';
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
    private configService: ConfigService,
    private localStorage: LocalStorageService,
    private router: Router
  ) {
    this.initCart();
  }

  initCart(): Observable<void> {
    return new Observable((observable) => {
      if (this.authService.loggedIn()) {
        const sub = this.getCartFromDb().subscribe((cart) => {
          this.cart.next(cart);
          observable.next();
          observable.complete();
          sub.unsubscribe();
        });
      } else {
        // const orders = this.localStorage.getObject<Order[]>(StorageKey.Cart) || [];
        this.cart.next([]);
        observable.next();
        observable.complete();
      }
    });
  }

  purchaseOrder(contactInfo: Contact): Observable<any> {
    return this.http.post(
      this.configService.config.domain + 'operation/purchase-order',
      contactInfo
    );
  }

  updateCart(orders: Order[]): void {
    if (this.authService.loggedIn()) {
      if (orders.length <= 0) {
        return;
      }
      this.updateDbCart(orders).subscribe({
        next: (data) => {
          this.cart.next(orders);
        },
        error: (err) => console.log(err)
      });
    } else {
      this.router.navigateByUrl('login');
      // this.updateLocaleStorage(orders);
      // this.cart.next(orders);
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
    this.localStorage.setObject(StorageKey.Cart, orders);
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
