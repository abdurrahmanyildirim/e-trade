import { Injectable } from '@angular/core';
import { OrderStatus } from './model';

@Injectable()
export class MnOrdersFactory {
  createOrderStatusesList(): OrderStatus[] {
    return [
      {
        key: -1,
        desc: 'İptal Edilenler'
      },
      {
        key: 0,
        desc: 'Yeni Siparişler'
      },
      {
        key: 1,
        desc: 'İşleme Alınanlar'
      },
      {
        key: 2,
        desc: 'Kargoya Verilenler'
      },
      {
        key: 3,
        desc: 'Teslim Edilenler'
      }
    ];
  }
}
