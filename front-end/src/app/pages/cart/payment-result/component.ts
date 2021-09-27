import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-result',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PaymentResulComponent implements OnInit {
  @Input() result: string;
  @Input() errorMsg = '';

  constructor() {}
  ngOnInit(): void {
    if (this.result === 'true') {
      this.setOrders();
    }
  }

  setOrders(): void {
    console.log('Orders Setted');
  }
}
