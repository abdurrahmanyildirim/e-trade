import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { DialogType } from 'src/app/shared/components/dialog/component';
import { DialogService } from 'src/app/shared/components/dialog/service';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { Order } from 'src/app/shared/models/order';
import { ProductInfo } from 'src/app/shared/models/product';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { ProductService } from 'src/app/shared/services/rest/product.service';
import { isPresent } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent implements OnInit, OnDestroy {
  orders: Order[];
  subs = new Subscription();
  quantityChange = new Subject<Order[]>();
  totalCost: number;
  cartStepActive = true;
  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private cartService: CartService,
    private router: Router,
    private snackbar: SnackbarService,
    private productService: ProductService,
    private dialogService: DialogService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initOrders();
    this.initQuantityChange();
  }

  initOrders(): void {
    this.cartService.cart.subscribe({
      next: (orders) => {
        this.orders = orders;
        this.calculateTotalCost();
        this.cd.detectChanges();
      }
    });
  }

  toggleStepper(): void {
    if (this.cartStepActive) {
      this.stepper.next();
      this.cartStepActive = false;
    } else {
      this.stepper.previous();
      this.cartStepActive = true;
    }
  }

  onSelectionChange(): void {
    if (this.stepper.selectedIndex !== 0) {
      return;
    }
    const prods = this.orders.slice().map((order) => {
      return {
        id: order.productId,
        quantity: order.quantity
      } as ProductInfo;
    });
    const subs = this.productService.stockControl(prods).subscribe({
      next: (prodInfos) => {
        const nonExistProducts = prodInfos.filter(
          (prod) => prod.hasEnoughStock === false || prod.isActive === false
        );
        if (nonExistProducts.length > 0) {
          this.stepper.selectedIndex = 0;
          this.cartStepActive = true;
          this.dialogService.cartWarning({
            acceptButton: 'Tamam',
            desc: 'Aşağıdaki ürünlerde maksimum alabileceğiniz miktar belirtilmiştir.',
            dialog: DialogType.CartWarning,
            onClose: (result) => {
              // console.log(result);
            },
            products: nonExistProducts
          });
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.subs.add(subs);
  }

  initQuantityChange(): void {
    const sub = this.quantityChange.pipe(throttleTime(500)).subscribe({
      next: (orders) => {
        const subs2 = this.cartService.updateCart(this.orders).subscribe({
          next: (result) => {
            if (result) {
              this.snackbar.showInfo('Sepetiniz güncellendi.');
              this.calculateTotalCost();
            }
          },
          error: (err) => {
            console.error(err);
            this.snackbar.showError('Güncelleme sırasında bir hata oldu');
          }
        });
        this.subs.add(subs2);
      },
      error: (err) => console.log(err)
    });
    this.subs.add(sub);
  }

  onOrderListChange(orders: Order[]): void {
    this.quantityChange.next(orders);
  }

  calculateTotalCost(): void {
    let cost = 0;
    this.orders.forEach((order) => {
      cost += (order.price - order.price * order.discountRate) * order.quantity;
    });
    this.totalCost = cost;
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
