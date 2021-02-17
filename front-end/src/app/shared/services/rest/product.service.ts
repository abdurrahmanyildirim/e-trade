import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, CloudinaryPhoto, Product } from '../../models/product';
import { ConfigService } from '../site/config.service';

@Injectable()
export class ProductService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  allProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.configService.config.domain + 'product/products');
  }

  categories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.configService.config.domain + 'category/categories');
  }

  productsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      this.configService.config.domain + 'product/get-by-category?category=' + category
    );
  }

  productById(id: string): Observable<Product> {
    return this.http.get<Product>(this.configService.config.domain + 'product/get-by-id?id=' + id);
  }

  uploadPhoto(photos: FormData): Observable<CloudinaryPhoto[]> {
    return this.http.post<CloudinaryPhoto[]>(
      this.configService.config.domain + 'photo/upload',
      photos
    );
  }

  addNewProduct(product: Product): Observable<void> {
    return this.http.post<void>(this.configService.config.domain + 'product/new-product', product);
  }
}
