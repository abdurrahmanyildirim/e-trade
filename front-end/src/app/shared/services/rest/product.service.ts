import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Category, Product } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  allProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(environment.domain + 'products.json');
  }

  // getProductsByCategory(category: Category) {
  //   return this.http.get<Product[]>(environment.domain + 'products.json');
  // }
}
