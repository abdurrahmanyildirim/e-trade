import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { isPresent } from 'src/app/shared/util/common';

@Component({
  selector: 'app-header',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class HeaderComponent implements OnInit {
  value = '';
  hasCartItem = false;
  cartLength = 0;
  constructor(private cartService: CartService) {}
  ngOnInit(): void {
    this.checkCart();
  }

  checkCart(): void {
    this.cartService.cart.subscribe((orders) => {
      if (isPresent(orders)) {
        this.cartLength = orders.length;
      }
    });
  }
}
