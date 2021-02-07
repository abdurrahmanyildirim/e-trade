import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CartService } from '../rest/cart.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SplashService {
  configInited = false;

  constructor(private configService: ConfigService, private cartService: CartService) {}

  init(): void {
    const obs = [this.cartService.initCart()];
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
