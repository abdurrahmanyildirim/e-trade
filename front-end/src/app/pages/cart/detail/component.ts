import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DialogType } from 'src/app/shared/components/dialog/component';
import { DialogService } from 'src/app/shared/components/dialog/service';
import { Order } from 'src/app/shared/models/order';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { UtilityService } from 'src/app/shared/services/site/utility.service';
import { isPresent } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';

@Component({
  selector: 'app-cart-info',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartDetailComponent implements OnDestroy, OnInit {
  orders: Order[];
  subs = new Subscription();
  isMobile = false;

  constructor(
    private utilService: UtilityService,
    private dialogService: DialogService,
    private cartService: CartService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (document.body.clientWidth <= 650) {
      this.isMobile = true;
    }
    this.initOrders();
  }

  initOrders(): void {
    const subs = this.cartService.cart.subscribe({
      next: (orders) => {
        this.orders = orders;
        this.cd.detectChanges();
      }
    });
    this.subs.add(subs);
  }

  onOrderRemove(removedOrder: Order): void {
    this.dialogService.confirm({
      acceptButton: 'Onayla',
      refuseButton: 'Vazgeç',
      desc: 'Ürünü sepetinizden kaldırmak istediğinize emin misiniz?',
      onClose: (result) => {
        if (result) {
          const indexRemovedOrder = this.orders.indexOf(removedOrder);
          this.orders.splice(indexRemovedOrder, 1);
          this.cartService.cart.next(this.orders);
        }
      },
      dialog: DialogType.Confirm
    });
  }

  onQuantityChange(): void {
    this.cartService.cart.next(this.orders);
  }

  showPhotoBigger(path: string): void {
    this.utilService.photoShower(path);
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
