import { Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product';
import { isPresent } from '../../util/common';
import { ProductService } from './product.service';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  subs = new Subscription();

  constructor(private socket: Socket, private productService: ProductService) {}

  init(): void {
    this.listenProductChange();
  }

  listenProductChange(): void {
    const subs = this.socket.fromEvent('product-change').subscribe((products: Product[]) => {
      this.productService.products.next(products);
    });
    this.subs.add(subs);
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
