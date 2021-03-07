import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  searchKey = '';
  products: SearchProduct[];
  filteredProducts: SearchProduct[] = [];
  @ViewChild('mobileNavMenu') mobileNavMenu: ElementRef<HTMLElement>;

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
    this.closeNav();
    this.router.navigateByUrl('filtered-page?category=' + category);
  }

  onMobileNavMenuClick(): void {
    if (this.mobileNavMenu.nativeElement.style.width) {
      this.mobileNavMenu.nativeElement.style.width = null;
    } else {
      this.mobileNavMenu.nativeElement.style.display = 'flex';
      this.mobileNavMenu.nativeElement.style.width = 100 + '%';
    }
  }

  closeNav(): void {
    this.mobileNavMenu.nativeElement.style.width = null;
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

  onSerchClick(): void {
    this.router.navigateByUrl('filtered-page?searchKey=' + this.searchKey);
    this.searchKey = '';
  }

  onSelectionChange(product: SearchProduct): void {
    this.router.navigateByUrl('filtered-page?searchKey=' + product.name);
    setTimeout(() => {
      this.searchKey = '';
    });
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
