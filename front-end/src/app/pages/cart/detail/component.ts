import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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

  constructor(private utilService: UtilityService) {}

  onOrderRemove(removedOrder: Order): void {
    const indexRemovedOrder = this.orders.indexOf(removedOrder);
    this.orders.splice(indexRemovedOrder, 1);
    this.emitChanges();
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
