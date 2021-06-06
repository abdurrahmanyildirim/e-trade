import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { OrderList, Status } from 'src/app/shared/models/order';
import { AuthService } from 'src/app/shared/services/rest/auth/service';
import { OrderService } from 'src/app/shared/services/rest/order/service';
import { isPresent } from 'src/app/shared/util/common';

@Component({
  selector: 'app-mn-order-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MnOrderDetailComponent implements OnInit, OnDestroy {
  order: OrderList;
  isInited = false;
  statuses: Status[];
  currentStatus: Status;
  orderDetailId: string;
  subs = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private snackbar: SnackbarService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const key = 'id';
      this.orderDetailId = params[key];
      this.initOrderDetail(params[key]);
    });
  }

  initOrderDetail(id: string): void {
    const sub = this.orderService.detail(id).subscribe({
      next: (orderDetail) => {
        this.order = orderDetail;
        this.initStatus();
      },
      error: (error) => console.log(error)
    });
    this.subs.add(sub);
  }

  initStatus(): void {
    const sub = this.orderService.getStatuses().subscribe({
      next: (statuses) => {
        this.statuses = statuses;
        const orderStatus = this.order.status[this.order.status.length - 1];
        this.currentStatus = {
          desc: orderStatus.desc,
          key: orderStatus.key
        };
        this.isInited = true;
        this.cd.detectChanges();
      },
      error: (err) => console.log(err)
    });
    this.subs.add(sub);
  }

  updateOrderStatus(): void {
    this.currentStatus.desc = this.statuses
      .find((status) => this.currentStatus.key === status.key)
      .desc.slice();
    const sub = this.orderService
      .updateOrderStatus(this.orderDetailId, this.currentStatus)
      .subscribe({
        next: () => {
          this.order.status.push(this.currentStatus);
          this.cd.detectChanges();
          this.snackbar.showSuccess('Sipariş Düzenlendi.');
        },
        error: (err) => {
          this.snackbar.showError('Düzenleme sırasında bir hata oldu.');
          console.log(err);
        }
      });
    this.subs.add(sub);
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
