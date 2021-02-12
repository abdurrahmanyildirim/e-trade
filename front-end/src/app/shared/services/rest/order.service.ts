import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDetail, OrderList, Status } from '../../models/order';
import { ConfigService } from '../site/config.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getOrders(): Observable<OrderList[]> {
    return this.http.get<OrderList[]>(this.configService.config.domain + 'order/get-orders');
  }

  orderDetail(id: string): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(this.configService.config.domain + 'order/detail/' + id);
  }

  getAllOrders(): Observable<OrderList[]> {
    return this.http.get<OrderList[]>(this.configService.config.domain + 'order/all-orders');
  }

  getStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(this.configService.config.domain + 'order/statuses');
  }

  updateOrderStatus(id: string, status: Status): Observable<void> {
    return this.http.post<void>(this.configService.config.domain + 'order/update-status/' + id, {
      status
    });
  }
}
