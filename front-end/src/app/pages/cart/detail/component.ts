import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DialogService } from 'src/app/shared/components/dialog/service';
import { Order } from 'src/app/shared/models/order';
import { UtilityService } from 'src/app/shared/services/site/utility.service';
import { ObjectHelper } from 'src/app/shared/util/helper/object';

@Component({
  selector: 'app-cart-info',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class CartDetailComponent implements OnDestroy {
  @Input() orders: Order[];
  @Output() orderListChange = new EventEmitter<Order[]>();

  constructor(private utilService: UtilityService, private dialogService: DialogService) {}

  onOrderRemove(removedOrder: Order): void {
    this.dialogService.openDialog({
      acceptButton: 'Onayla',
      refuseButton: 'Vazgeç',
      desc: 'Ürünü sepetinizden kaldırmak istediğinize emin misiniz?',
      onClose: (result) => {
        if (result) {
          const indexRemovedOrder = this.orders.indexOf(removedOrder);
          this.orders.splice(indexRemovedOrder, 1);
          this.emitChanges();
        }
      }
    });
  }

  emitChanges(): void {
    this.orderListChange.emit(this.orders);
  }

  showPhotoBigger(path: string): void {
    this.utilService.photoShower(path);
  }

  ngOnDestroy(): void {
    ObjectHelper.removeReferances(this);
  }
}
