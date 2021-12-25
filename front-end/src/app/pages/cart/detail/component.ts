import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { DialogType } from 'src/app/shared/components/dialog/component';
import { DialogService } from 'src/app/shared/components/dialog/service';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { Order } from 'src/app/shared/models/order';
import { CartService } from 'src/app/shared/services/rest/cart/service';
import { MobileDetectionService } from 'src/app/shared/services/site/mobile-detection';
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
  ordersSubs: Subscription;

  constructor(
    private utilService: UtilityService,
    private dialogService: DialogService,
    private cartService: CartService,
    private snackbar: SnackbarService,
    private cd: ChangeDetectorRef,
    public mobileDet: MobileDetectionService
  ) {}

  ngOnInit(): void {
    this.initOrders();
  }

  initOrders(): void {
    this.ordersSubs = this.cartService.cart.subscribe({
      next: (orders) => {
        this.orders = orders;
        this.cd.detectChanges();
      }
    });
  }

  onOrderRemove(removedOrder: Order): void {
    this.dialogService.confirm({
      acceptButton: 'Onayla',
      refuseButton: 'Vazgeç',
      desc: 'Ürünü sepetinizden kaldırmak istediğinize emin misiniz?',
      onClose: (result) => {
        if (result) {
          const orders = this.orders.filter((prod) => prod.productId !== removedOrder.productId);
          this.cartService
            .update(orders)
            .pipe(first())
            .subscribe({
              next: (res) => {
                if (res) {
                  this.snackbar.showSuccess('Ürün kaldırıldı.');
                }
              },
              error: (error) => {
                console.error(error);
                this.snackbar.showError('Ürün kaldırılamadı. Tekrar deneyiniz.');
              }
            });
        }
      },
      type: DialogType.Confirm
    });
  }

  onQuantityChange(): void {
    this.cartService
      .update(this.orders)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.snackbar.showSuccess('Sepet güncellendi.');
        },
        error: (error) => {
          console.error(error);
          this.snackbar.showError('Hata meydana geldi. Tekrar deneyiniz.');
        }
      });
  }

  showPhotoBigger(path: string): void {
    this.utilService.photoShower(path);
  }

  ngOnDestroy(): void {
    if (isPresent(this.ordersSubs)) {
      this.ordersSubs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
