import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogType } from 'src/app/shared/components/dialog/component';
import { DialogService } from 'src/app/shared/components/dialog/service';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { OrderDetail, OrderDetailProduct, Statuses } from 'src/app/shared/models/order';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { OrderService } from 'src/app/shared/services/rest/order.service';
import { ProductService } from 'src/app/shared/services/rest/product.service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  providers: [OrderService]
})
export class OrderDetailComponent implements OnInit {
  order: OrderDetail;
  orderId: string;
  currentUser: User;
  Statuses = Statuses;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private authService: AuthService,
    private productService: ProductService,
    private dialogService: DialogService,
    private screenHolder: ScreenHolderService,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser.value;
    this.activatedRoute.params.subscribe((params) => {
      // tslint:disable-next-line: no-string-literal
      this.orderId = params['id'];
      this.initOrder();
    });
  }

  initOrder(): void {
    this.orderService.orderDetail(this.orderId).subscribe({
      next: (data) => {
        this.order = data;
      },
      error: (err) => console.log(err)
    });
  }

  reviewDialog(product: OrderDetailProduct): void {
    this.dialogService.review({
      acceptButton: 'Tamamla',
      refuseButton: 'Vazgeç',
      desc: product.rate + '',
      dialog: DialogType.Review,
      onClose: (rate) => {
        if (!rate) {
          return;
        }
        this.screenHolder.show();
        this.productService.rateProduct(product.productId, this.orderId, rate).subscribe({
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
