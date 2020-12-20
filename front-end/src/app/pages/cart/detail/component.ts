import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Order } from 'src/app/shared/models/order';

@Component({
  selector: 'app-cart-info',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class CartDetailComponent {
  @Input() orders: Order[];
  @Output() orderListChange = new EventEmitter<Order[]>();

  onQuantityChange(): void {}

  onOrderRemove(removedOrder: Order): void {
    const indexRemovedOrder = this.orders.indexOf(removedOrder);
    this.orders.splice(indexRemovedOrder, 1);
    this.emitChanges();
  }

  emitChanges(): void {
    this.orderListChange.emit(this.orders);
  }
}
