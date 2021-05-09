import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { DialogType } from 'src/app/shared/components/dialog/component';
import { DialogService } from 'src/app/shared/components/dialog/service';
import { Order } from 'src/app/shared/models/order';
import { ProductInfo } from 'src/app/shared/models/product';
import { CartService } from 'src/app/shared/services/rest/cart/service';
import { ProductService } from 'src/app/shared/services/rest/product/service';
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
  totalCost: number;
  cartStepActive = true;
  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private dialogService: DialogService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initOrders();
  }

  initOrders(): void {
    const subs = this.cartService.cart.subscribe({
      next: (orders) => {
        this.orders = orders;
        this.calculateTotalCost();
        this.cd.markForCheck();
      }
    });
    this.subs.add(subs);
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
    if (this.stepper.selectedIndex === 0) {
      this.checkProducts();
    }
  }

  checkProducts(): void {
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
            data: nonExistProducts
          });
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.subs.add(subs);
  }

  calculateTotalCost(): void {
    this.totalCost = this.orders.reduce(
      (p, c: Order) => p + (c.price - c.price * c.discountRate) * c.quantity,
      0
    );
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
