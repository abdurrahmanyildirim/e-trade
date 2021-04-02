import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Category } from '../../models/product';
import { ConfigService } from '../site/config.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categories: BehaviorSubject<Category[]> = new BehaviorSubject([]);

  constructor(private configService: ConfigService, private http: HttpClient) {}

  init(): Observable<void> {
    return new Observable((observer) => {
      this.getCategories().subscribe({
        next: (categories) => {
          this.categories.next(categories);
          observer.next();
          observer.complete();
        },
        error: (error) => {
          console.log(error);
          observer.error(error);
        }
      });
    });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.configService.config.baseUrl + 'category/categories');
  }

  insertCategory(category: string): Observable<any> {
    return this.http.get<any>(
      this.configService.config.baseUrl + 'category/insert?category=' + category
    );
  }

  removeCategory(category: string): Observable<any> {
    return this.http.get<any>(
      this.configService.config.baseUrl + 'category/remove?category=' + category
    );
  }
}
