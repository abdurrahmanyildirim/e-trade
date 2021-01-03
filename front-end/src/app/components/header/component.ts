import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
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
  isAuth = false;

  constructor(private cartService: CartService, public authService: AuthService) {}
  ngOnInit(): void {
    this.checkCart();
    this.isAuth = this.authService.loggedIn();
  }

  checkCart(): void {
    this.cartService.cart.subscribe((orders) => {
      if (isPresent(orders)) {
        this.cartLength = orders.length;
      }
    });
  }
}
