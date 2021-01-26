import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { ProductService } from 'src/app/shared/services/rest/product.service';
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
  categories: any;
  subs = new Subscription();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.checkCart();
    this.initCategories();
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

  initCategories(): void {
    const sub = this.productService.categories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => console.log(err)
    });
    this.subs.add(sub);
  }

  firstLetterUppercase(name: string): string {
    return name[0].toUpperCase() + name.slice(1);
  }

  initCurrentUser(): void {
    const sub = this.authService.isAuth.subscribe((isAuth) => {
      this.isAuth = isAuth;
    });
    this.subs.add(sub);
  }

  logout(): void {
    this.authService.logout();
    this.cartService.cart.next([]);
    this.router.navigateByUrl('main');
  }

  navigateToFilteredPage(category: string): void {
    this.router.navigateByUrl('filtered-page?category=' + category);
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
