import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';
import { ConfigService } from '../site/config.service';

@Injectable()
export class ProductService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  allProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.configService.config.domain + 'product/products');
  }

  // getProductsByCategory(category: Category) {
  //   return this.http.get<Product[]>(environment.domain + 'products.json');
  // }
}
