import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderList, Status } from '../../models/order';
import { ConfigService } from '../site/config.service';
import { CryptoService } from '../site/crypto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private cryptoService: CryptoService
  ) {}

  getOrders(): Observable<OrderList[]> {
    return this.http.get<OrderList[]>(this.configService.config.baseUrl + 'order/get-orders').pipe(
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

  orderDetail(id: string): Observable<OrderList> {
    return this.http.get<OrderList>(this.configService.config.baseUrl + 'order/detail/' + id).pipe(
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

  getAllOrders(): Observable<OrderList[]> {
    return this.http.get<OrderList[]>(this.configService.config.baseUrl + 'order/all-orders').pipe(
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
    return this.http.get<Status[]>(this.configService.config.baseUrl + 'order/statuses');
  }

  updateOrderStatus(id: string, status: Status): Observable<void> {
    return this.http.post<void>(this.configService.config.baseUrl + 'order/update-status/' + id, {
      status
    });
  }
}
