import { Component, Input } from '@angular/core';
import { DialogData } from '../component';

@Component({
  selector: 'app-cart-warning',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class CartWarningComponent {
  @Input() data: DialogData;
}
