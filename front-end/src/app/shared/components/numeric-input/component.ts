import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-numeric-input',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class NumericInputComponent {
  @Input() quantity: number;
  @Input() width?: number;
  @Input() height?: number;
  @Output() quantityChange = new EventEmitter<number>();

  numbers = '0123456789';

  increment(): void {
    if (this.quantity >= 100) {
      return;
    }
    this.quantity++;
    this.triggerChange();
  }

  decrement(): void {
    if (this.quantity <= 1) {
      return;
    }
    this.quantity--;
    this.triggerChange();
  }

  onKeyup(event: KeyboardEvent): void {
    const quantity = this.quantity.toString();
    if (quantity === '') {
      this.quantity = 1;
      this.triggerChange();
      return;
    }
    let numbers = '';
    for (const item of quantity) {
      if (this.numbers.includes(item)) {
        numbers += item;
      }
    }
    const result = parseInt(numbers, 10) > 100 ? 100 : parseInt(numbers, 10);
    this.quantity = result;
    this.triggerChange();
  }

  triggerChange(): void {
    this.quantityChange.emit(this.quantity);
  }
}
