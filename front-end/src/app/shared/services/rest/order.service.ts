import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../models/order';
import { ConfigService } from '../site/config.service';

@Injectable()
export class OrderService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.configService.config.domain + 'order/get-orders');
  }

  // getProductsByCategory(category: Category) {
  //   return this.http.get<Product[]>(environment.domain + 'products.json');
  // }
}
