import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { isPresent } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';

@Component({
  selector: 'app-header',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  value = '';
  hasCartItem = false;
  cartLength = 0;
  isAuth = false;
  subs = new Subscription();

  constructor(private cartService: CartService, public authService: AuthService) {}

  ngOnInit(): void {
    this.checkCart();
    this.initCurrentUser();
  }

  checkCart(): void {
    const sub = this.cartService.cart.subscribe((orders) => {
      if (isPresent(orders)) {
        this.cartLength = orders.length;
      }
    });
    this.subs.add(sub);
  }

  initCurrentUser(): void {
    const sub = this.authService.isAuth.subscribe((isAuth) => {
      this.isAuth = isAuth;
    });
    this.subs.add(sub);
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
