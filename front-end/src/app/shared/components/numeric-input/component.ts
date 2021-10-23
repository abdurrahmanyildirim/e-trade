import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ObjectHelper } from '../../util/helper/object';

@Component({
  selector: 'app-numeric-input',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class NumericInputComponent implements OnDestroy {
  @Input() quantity: number;
  @Input() width?: number;
  @Input() height?: number;
  @Input() max?: number;
  @Output() quantityChange = new EventEmitter<number>();

  increment(): void {
    if (this.quantity >= this.max) {
      return;
    }
    this.quantity++;
    this.quantityChange.emit(this.quantity);
  }

  decrement(): void {
    if (this.quantity <= 1) {
      return;
    }
    this.quantity--;
    this.quantityChange.emit(this.quantity);
  }

  ngOnDestroy(): void {
    ObjectHelper.removeReferances(this);
  }
}
