import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, ProductInfo } from 'src/app/shared/models/product';
import { BaseRestService } from '../base';
import { RequestMethod, RequestOptions, RequestRoute } from '../model';
import { ServiceMethod } from './model';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseRestService {
  products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  route = RequestRoute.product;

  constructor(protected injector: Injector) {
    super(injector);
  }

  init(): Observable<void> {
    return new Observable<void>((observer) => {
      this.getProducts().subscribe({
        next: (products) => {
          this.products.next(products);
          observer.next();
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  getProducts(): Observable<Product[]> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.empty
    } as RequestOptions;
    return this.send<Product[]>(options);
  }

  getAll(): Observable<Product[]> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.all
    } as RequestOptions;
    return this.send<Product[]>(options);
  }

  stockControl(products: ProductInfo[]): Observable<ProductInfo[]> {
    const options = {
      method: RequestMethod.post,
      serviceMethod: ServiceMethod.stockControl,
      body: products
    } as RequestOptions;
    return this.send<ProductInfo[]>(options);
  }

  getByCategory(category: string): Observable<Product[]> {
    const options = {
      method: RequestMethod.get,
      params: { category },
      serviceMethod: ServiceMethod.getByCategory
    } as RequestOptions;
    return this.send<Product[]>(options);
  }

  remove(id: string): Observable<any> {
    const options = {
      method: RequestMethod.delete,
      params: { id },
      serviceMethod: ServiceMethod.remove
    } as RequestOptions;
    return this.send<any>(options);
  }

  update(product: Product): Observable<any> {
    const options = {
      method: RequestMethod.post,
      serviceMethod: ServiceMethod.update,
      body: product
    } as RequestOptions;
    return this.send<any>(options);
  }

  getById(id: string): Observable<Product> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.getById,
      params: { id }
    } as RequestOptions;
    return this.send<Product>(options);
  }

  rate(productId: string, orderId: string, rate: number, desc: string): Observable<any> {
    const options = {
      method: RequestMethod.get,
      params: {
        productId,
        orderId,
        rate,
        desc
      },
      serviceMethod: ServiceMethod.rating
    } as RequestOptions;
    return this.send<any>(options);
  }

  insert(product: Product): Observable<void> {
    const options = {
      method: RequestMethod.post,
      serviceMethod: ServiceMethod.insert,
      body: product
    } as RequestOptions;
    return this.send<void>(options);
  }
}
