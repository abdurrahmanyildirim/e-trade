import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CartService } from '../rest/cart.service';
import { CategoryService } from '../rest/category';
import { ProductService } from '../rest/product.service';
import { ConfigService } from './config.service';
import { StateService } from './state';

@Injectable({
  providedIn: 'root'
})
export class SplashService {
  configInited = false;

  constructor(
    private configService: ConfigService,
    private cartService: CartService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private stateService: StateService
  ) {}

  init(): void {
    const obs = [
      this.cartService.init(),
      this.categoryService.init(),
      this.productService.init(),
      this.stateService.init()
    ];
    this.configService.initSiteConfig().subscribe({
      next: () => {
        forkJoin(obs).subscribe({
          next: () => {
            this.configInited = true;
          },
          error: (err) => console.log(err)
        });
      }
    });
  }
}
