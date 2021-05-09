import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CartService } from '../rest/cart/service';
import { CategoryService } from '../rest/category/service';
import { ProductService } from '../rest/product/service';
import { SocketService } from '../socket/socket';
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
    private stateService: StateService,
    private socketService: SocketService
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
            this.socketService.init();
            this.configInited = true;
          },
          error: (err) => console.log(err)
        });
      }
    });
  }
}
