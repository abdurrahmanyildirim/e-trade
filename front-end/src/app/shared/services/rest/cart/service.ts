import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { PurchaseInfo } from 'src/app/pages/cart/purchase-order/model';
import { Order } from 'src/app/shared/models/order';
import { StorageKey } from 'src/app/shared/models/storage';
import { LocalStorageService } from '../../site/storage/local';
import { AuthService } from '../auth/service';
import { BaseRestService } from '../base';
import { RequestMethod, RequestOptions, RequestRoute } from '../model';
import { ServiceMethod } from './model';

@Injectable({
  providedIn: 'root'
})
export class CartService extends BaseRestService {
  public cart = new BehaviorSubject<Order[]>([]);
  route = RequestRoute.cart;

  constructor(
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private router: Router,
    protected injector: Injector
  ) {
    super(injector);
  }

  init(): Observable<void> {
    return new Observable((observer) => {
      if (this.authService.loggedIn()) {
        const sub = this.getFromDb().subscribe((cart) => {
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
    const options = {
      method: RequestMethod.post,
      body: contactInfo,
      serviceMethod: ServiceMethod.purchaseOrder
    } as RequestOptions;
    return this.send<any>(options);
  }

  update(orders: Order[]): Observable<boolean> {
    return new Observable((observer) => {
      if (this.authService.loggedIn()) {
        this.updateDb(orders).subscribe({
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
        this.router.navigateByUrl('auth/login');
        observer.next(false);
        observer.complete();
      }
    });
  }

  private updateDb(orders: Order[]): Observable<Order[]> {
    const options = {
      method: RequestMethod.post,
      body: orders,
      serviceMethod: ServiceMethod.update
    } as RequestOptions;
    return this.send<Order[]>(options);
  }

  private getFromDb(): Observable<Order[]> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.empty
    } as RequestOptions;
    return this.send<Order[]>(options);
  }

  updateLocaleStorage(orders: Order[]): void {
    this.localStorage.setObject(StorageKey.Cart, orders);
  }
}
