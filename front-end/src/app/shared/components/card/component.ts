import { Component, Input } from '@angular/core';
import { Product } from 'src/app/shared/models/product';

@Component({
  selector: 'app-card',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class CardComponent {
  @Input() product: Product;
}
