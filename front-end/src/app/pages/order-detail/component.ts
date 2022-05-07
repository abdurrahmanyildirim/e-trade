import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogType } from 'src/app/shared/components/dialog/component';
import { DialogService } from 'src/app/shared/components/dialog/service';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { OrderList, OrderListProduct, Statuses } from 'src/app/shared/models/order';
import { OrderService } from 'src/app/shared/services/rest/order/service';
import { ProductService } from 'src/app/shared/services/rest/product/service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder';
import { isPresent } from 'src/app/shared/util/common';

@Component({
  selector: 'app-order-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  providers: [OrderService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  order: OrderList;
  orderId: string;
  Statuses = Statuses;
  subs = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private productService: ProductService,
    private dialogService: DialogService,
    private screenHolder: ScreenHolderService,
    private snackBar: SnackbarService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const subs = this.activatedRoute.params.subscribe((params) => {
      // tslint:disable-next-line: no-string-literal
      this.orderId = params['id'];
      this.initOrder();
    });
    this.subs.add(subs);
  }

  initOrder(): void {
    const subs = this.orderService.detail(this.orderId).subscribe({
      next: (data) => {
        this.order = data;
        this.cd.detectChanges();
      },
      error: (err) => console.log(err)
    });
    this.subs.add(subs);
  }

  showContracts(): void {
    this.dialogService.contracts({
      acceptButton: 'Tamam',
      data: {
        orderInfo: {
          name: this.order.userName,
          address:
            this.order.contactInfo.address +
            ' ' +
            this.order.contactInfo.district +
            '/' +
            this.order.contactInfo.city,
          date: new Date(),
          email: this.order.email,
          phone: this.order.contactInfo.phone
        },
        orders: this.order.products.map((order) => {
          return {
            productName: order.name,
            price: order.price,
            discountRate: order.discountRate,
            quantity: order.quantity
          };
        })
      },
      desc: '',
      onClose: () => {},
      type: DialogType.SalesAndInformationContract
    });
  }

  reviewDialog(product: OrderListProduct): void {
    const rate = product.comment?.rate ? product.comment.rate : 0;
    const desc = product.comment?.desc ? product.comment.desc : '';
    this.dialogService.review({
      acceptButton: 'Tamamla',
      refuseButton: 'Vazgeç',
      desc,
      rate,
      type: DialogType.Rating,
      onClose: (comment) => {
        if (!comment) {
          return;
        }
        this.productService
          .rate(product.productId, this.orderId, comment.currentRate, comment.desc.trim())
          .subscribe({
            next: () => {
              this.screenHolder.show();
              this.screenHolder.hide();
              this.snackBar.showInfo('Geri bildiriminiz için teşekkürler');
              this.initOrder();
            },
            error: (err) => {
              this.screenHolder.hide();
              this.snackBar.showError(err.error.message);
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
