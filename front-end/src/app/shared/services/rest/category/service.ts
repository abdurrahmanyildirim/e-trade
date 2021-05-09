import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from 'src/app/shared/models/product';
import { BaseRestService } from '../base';
import { RequestMethod, RequestType, RequestOptions } from '../model';
import { ServiceMethod } from './model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseRestService {
  categories: BehaviorSubject<Category[]> = new BehaviorSubject([]);
  requestType = RequestType.category;

  constructor(protected injector: Injector) {
    super(injector);
  }

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
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.empty
    } as RequestOptions;
    return this.send<any>(options);
  }

  insert(category: string): Observable<any> {
    const options = {
      method: RequestMethod.get,
      params: { category },
      serviceMethod: ServiceMethod.insert
    } as RequestOptions;
    return this.send<any>(options);
  }

  remove(category: string): Observable<any> {
    const serviceOptions = {
      method: RequestMethod.get,
      params: { category },
      serviceMethod: ServiceMethod.remove
    } as RequestOptions;
    return this.send<any>(serviceOptions);
  }
}
