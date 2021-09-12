import { Injectable } from '@angular/core';
import { Tab } from './model';

@Injectable()
export class ManagementFactory {
  create(): Tab[] {
    return [
      {
        name: 'Siparişler',
        route: 'orders'
      },
      {
        name: 'Ürünler',
        route: 'products'
      },
      {
        name: 'Ürün Ekle',
        route: 'new-product'
      },
      {
        name: 'Mesaj Kutusu',
        route: 'message-box'
      },
      {
        name: 'Kategoriler',
        route: 'category'
      },
      {
        name: 'Diğer',
        route: 'other'
      }
    ];
  }
}
