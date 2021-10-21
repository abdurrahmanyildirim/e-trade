import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cargo, OrderList, Status } from 'src/app/shared/models/order';
import { CryptoService } from '../../site/crypto';
import { BaseRestService } from '../base';
import { RequestMethod, RequestOptions, RequestRoute } from '../model';
import { ServiceMethod } from './model';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseRestService {
  route = RequestRoute.order;
  constructor(private cryptoService: CryptoService, protected injector: Injector) {
    super(injector);
  }

  getOrders(): Observable<OrderList[]> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.empty
    } as RequestOptions;
    return this.send<OrderList[]>(options).pipe(
      map((orderDetails) => {
        return orderDetails.map((orderDetail) => {
          const contactInfo = {
            address: this.cryptoService.basicDecrypt(orderDetail.contactInfo.address),
            city: this.cryptoService.basicDecrypt(orderDetail.contactInfo.city),
            district: this.cryptoService.basicDecrypt(orderDetail.contactInfo.district),
            phone: this.cryptoService.basicDecrypt(orderDetail.contactInfo.phone)
          };
          orderDetail.contactInfo = contactInfo;
          return orderDetail;
        });
      })
    );
  }

  detail(id: string): Observable<OrderList> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.detail,
      params: { id }
    } as RequestOptions;
    return this.send<OrderList>(options).pipe(
      map((orderDetail) => {
        const contactInfo = {
          address: this.cryptoService.basicDecrypt(orderDetail.contactInfo.address),
          city: this.cryptoService.basicDecrypt(orderDetail.contactInfo.city),
          district: this.cryptoService.basicDecrypt(orderDetail.contactInfo.district),
          phone: this.cryptoService.basicDecrypt(orderDetail.contactInfo.phone)
        };
        orderDetail.contactInfo = contactInfo;
        orderDetail.email = this.cryptoService.basicDecrypt(orderDetail.email);
        return orderDetail;
      })
    );
  }

  getAll(): Observable<OrderList[]> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.all
    } as RequestOptions;
    return this.send<OrderList[]>(options).pipe(
      map((orderDetails) => {
        return orderDetails.map((orderDetail) => {
          const contactInfo = {
            address: this.cryptoService.basicDecrypt(orderDetail.contactInfo.address),
            city: this.cryptoService.basicDecrypt(orderDetail.contactInfo.city),
            district: this.cryptoService.basicDecrypt(orderDetail.contactInfo.district),
            phone: this.cryptoService.basicDecrypt(orderDetail.contactInfo.phone)
          };
          orderDetail.contactInfo = contactInfo;
          return orderDetail;
        });
      })
    );
  }

  getStatuses(): Observable<Status[]> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.statuses
    } as RequestOptions;
    return this.send<Status[]>(options);
  }

  updateOrderStatus(id: string, status: Status, inform: boolean, cargo?: Cargo): Observable<void> {
    const options = {
      method: RequestMethod.post,
      serviceMethod: ServiceMethod.updateStatus,
      body: { status, id, cargo, inform }
    } as RequestOptions;
    return this.send<void>(options);
  }
}
