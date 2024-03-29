import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CartService } from '../rest/cart/service';
import { CategoryService } from '../rest/category/service';
import { ProductService } from '../rest/product/service';
import { SocketService } from '../socket/socket';
import { ConfigService } from './config';
import { GTAGService } from './gtag';
import { MobileDetectionService } from './mobile-detection';
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
    private socketService: SocketService,
    private gtagService: GTAGService,
    private mobileDetectionService: MobileDetectionService
  ) {}

  init(): void {
    const obs = [
      this.cartService.init(),
      this.categoryService.init(),
      this.productService.init(),
      this.stateService.init()
    ];
    const subs = this.configService
      .init()
      .pipe(switchMap(() => forkJoin(obs)))
      .subscribe({
        next: () => {
          this.mobileDetectionService.init();
          this.socketService.init();
          this.gtagService.init(this.configService.config.gtagKey);
          this.configInited = true;
          subs.unsubscribe();
        },
        error: (err) => console.log(err)
      });
  }
}
