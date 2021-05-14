import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogType } from 'src/app/shared/components/dialog/component';
import { DialogService } from 'src/app/shared/components/dialog/service';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { OrderList, OrderListProduct, Statuses } from 'src/app/shared/models/order';
import { OrderService } from 'src/app/shared/services/rest/order/service';
import { ProductService } from 'src/app/shared/services/rest/product/service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  providers: [OrderService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailComponent implements OnInit {
  order: OrderList;
  orderId: string;
  Statuses = Statuses;

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
    this.activatedRoute.params.subscribe((params) => {
      // tslint:disable-next-line: no-string-literal
      this.orderId = params['id'];
      this.initOrder();
    });
  }

  initOrder(): void {
    this.orderService.detail(this.orderId).subscribe({
      next: (data) => {
        this.order = data;
        this.cd.detectChanges();
      },
      error: (err) => console.log(err)
    });
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
    this.dialogService.review({
      acceptButton: 'Tamamla',
      refuseButton: 'Vazgeç',
      desc: product.rate + '',
      type: DialogType.Rating,
      onClose: (rate) => {
        if (!rate) {
          return;
        }
        this.screenHolder.show();
        this.productService.rate(product.productId, this.orderId, rate).subscribe({
          next: () => {
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
}
