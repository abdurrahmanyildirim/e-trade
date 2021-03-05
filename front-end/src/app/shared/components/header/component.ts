import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Roles } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { ProductService } from 'src/app/shared/services/rest/product.service';
import { isPresent } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { SearchProduct } from './model';

@Component({
  selector: 'app-header',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  categories: any;
  roles = Roles;
  subs = new Subscription();
  searchKey: string = '';
  products: SearchProduct[];
  filteredProducts: SearchProduct[] = [];

  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.initCategories();
    this.initProducts();
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

  logout(): void {
    this.authService.logout();
    this.cartService.cart.next([]);
    this.authService.role.next(this.authService.getRole());
    this.router.navigateByUrl('main');
  }

  navigateToFilteredPage(category: string): void {
    this.router.navigateByUrl('filtered-page?category=' + category);
  }

  onKeyup(): void {
    this.filteredProducts = this.products
      .filter((product) => {
        const key = new RegExp(this.searchKey, 'gi');
        if (product.name.search(key) >= 0) {
          return product;
        }
      })
      .slice(0, 10);
  }

  initProducts(): void {
    this.productService
      .products()
      .pipe(
        map((products) =>
          products.map((prod) => {
            return {
              name: prod.name,
              brand: prod.brand,
              _id: prod._id
            };
          })
        )
      )
      .subscribe({
        next: (products) => {
          this.products = products as SearchProduct[];
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  onSelectionChange(product: SearchProduct) {
    this.searchKey = '';
    const href = window.location.href;
    if (href.includes('product-detail')) {
      this.router.navigateByUrl('product-detail/' + product._id).then(() => {
        window.location.reload();
      });
    } else {
      this.router.navigateByUrl('product-detail/' + product._id);
    }
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
