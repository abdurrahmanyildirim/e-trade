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
import { OrderList, Status } from 'src/app/shared/models/order';
import { OrderService } from 'src/app/shared/services/rest/order/service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder.service';
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
  isCargo: boolean;
  cargoNo = '';
  subs = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private snackbar: SnackbarService,
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
    private screenHolderService: ScreenHolderService
  ) {}

  ngOnInit(): void {
    const sub = this.activatedRoute.params.subscribe((params) => {
      const key = 'id';
      this.orderDetailId = params[key];
      this.initOrderDetail(params[key]);
    });
    this.subs.add(sub);
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
    this.dialogService.orderUpdate({
      acceptButton: 'Güncelle',
      desc: '',
      type: DialogType.OrderUpdate,
      onClose: (result) => {
        if (result) {
          this.screenHolderService.show();
          this.currentStatus = result.status;
          const sub = this.orderService
            .updateOrderStatus(this.orderDetailId, this.currentStatus, result.inform, result.cargo)
            .subscribe({
              next: () => {
                this.order.status.push(this.currentStatus);
                this.cd.detectChanges();
                this.snackbar.showSuccess('Sipariş Düzenlendi.');
                this.screenHolderService.hide();
              },
              error: (err) => {
                this.snackbar.showError('Düzenleme sırasında bir hata oldu.');
                console.log(err);
                this.screenHolderService.hide();
              }
            });
          this.subs.add(sub);
        }
      },
      data: {
        currentStatus: this.currentStatus,
        statuses: this.statuses
      }
    });
  }

  onSelectionChange(): void {
    if (this.currentStatus.key === 2) {
      this.isCargo = true;
    } else {
      this.isCargo = false;
    }
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
