import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { PurchaseInfo } from 'src/app/pages/cart/purchase-order/model';
import { Order } from '../../models/order';
import { StorageKey } from '../../models/storage';
import { isPresent } from '../../util/common';
import { ConfigService } from '../site/config.service';
import { LocalStorageService } from '../site/storage/local';
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
    this.init();
  }

  init(): Observable<void> {
    return new Observable((observer) => {
      if (this.authService.loggedIn()) {
        const sub = this.getCartFromDb().subscribe((cart) => {
          this.cart.next(cart);
          observer.next();
          observer.complete();
          sub.unsubscribe();
        });
      } else {
        this.localStorage.removeItem(StorageKey.Cart);
        // const orders = this.localStorage.getObject<Order[]>(StorageKey.Cart) || [];
        this.cart.next([]);
        observer.next();
        observer.complete();
      }
    });
  }

  purchaseOrder(contactInfo: PurchaseInfo): Observable<any> {
    return this.http.post(
      this.configService.config.baseUrl + 'operation/purchase-order',
      contactInfo
    );
  }

  updateCart(orders: Order[]): Observable<boolean> {
    return new Observable((observer) => {
      if (this.authService.loggedIn()) {
        this.updateDbCart(orders).subscribe({
          next: (data) => {
            this.cart.next(orders);
            observer.next(true);
            observer.complete();
          },
          error: (err) => {
            console.log(err);
            observer.error(err);
          }
        });
      } else {
        this.router.navigateByUrl('login');
        observer.next();
        observer.complete();
      }
    });
  }

  private updateDbCart(orders: Order[]): Observable<Order[]> {
    return this.http.post<Order[]>(
      this.configService.config.baseUrl + 'operation/update-cart',
      orders
    );
  }

  getCartFromDb(): Observable<Order[]> {
    return this.http.get<Order[]>(this.configService.config.baseUrl + 'operation/cart');
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
