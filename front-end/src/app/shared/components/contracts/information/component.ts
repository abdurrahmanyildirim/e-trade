import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-information-contract',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class InformationContractComponent implements OnInit {
  totalCost: number;
  @Input() orders;
  @Input() orderInfo;

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
