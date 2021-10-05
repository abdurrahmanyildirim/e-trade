import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Status } from 'src/app/shared/models/order';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { DialogProps } from '../component';

@Component({
  selector: 'app-order-update',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderUpdateDialogComponent implements OnInit, OnDestroy {
  @Input() dialog: DialogProps;
  order = {
    status: {
      key: 0,
      desc: ''
    } as Status,
    cargo: {
      no: '',
      company: ''
    },
    inform: true
  };

  ngOnInit(): void {
    this.order.status = this.dialog.data.currentStatus;
  }

  onSelectionChange(): void {
    this.order.status = this.dialog.data.statuses
      .slice()
      .find((status) => status.key === this.order.status.key);
  }

  ngOnDestroy(): void {
    ObjectHelper.removeReferances(this);
  }
}
