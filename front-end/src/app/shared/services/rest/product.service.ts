import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, CloudinaryPhoto, Product } from '../../models/product';
import { ConfigService } from '../site/config.service';

@Injectable()
export class ProductService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  uploadPhotos(photos: File[]): Observable<CloudinaryPhoto[]> {
    return new Observable<CloudinaryPhoto[]>((observer) => {
      const fd = new FormData();
      photos.forEach((photo) => {
        fd.append('photos', photo, photo.name);
      });
      const sub = this.uploadPhoto(fd).subscribe({
        next: (uploadedPhotos: CloudinaryPhoto[]) => {
          observer.next(uploadedPhotos);
          sub.unsubscribe();
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

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

  remove(id: string): Observable<any> {
    return this.http.delete<any>(this.configService.config.domain + 'product/remove?id=' + id);
  }

  update(product: Product): Observable<any> {
    return this.http.post<any>(this.configService.config.domain + 'product/update', product);
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
