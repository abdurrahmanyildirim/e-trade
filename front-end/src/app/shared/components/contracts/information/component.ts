import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-information',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class InformationComponent implements OnInit {
  totalCost: number;
  @Input() orders = [
    {
      productName: 'Deneme',
      price: 60,
      discountRate: 0.5,
      quantity: 5
    },
    {
      productName: 'Deneme 2',
      price: 20,
      discountRate: 0,
      quantity: 2
    },
    {
      productName: 'Deneme 3',
      price: 20,
      discountRate: 0.8,
      quantity: 1
    }
  ];
  @Input() orderInfo = {
    name: 'Abdurrahman Yıldırım',
    address: 'Songül sokak no:19 daire 2 Sultanbeyli/İstanbul',
    date: new Date()
  };

  ngOnInit(): void {
    this.calculateTotalCost();
  }

  calculateTotalCost(): void {
    this.totalCost = this.orders.reduce(
      (p, c) => p + (c.price - c.price * c.discountRate) * c.quantity,
      0
    );
  }
}
