import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Roles } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { ProductService } from 'src/app/shared/services/rest/product.service';
import { isPresent } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { CategoryService } from '../../services/rest/category';
import { SearchProduct } from './model';

@Component({
  selector: 'app-header',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  roles = Roles;
  subs = new Subscription();
  searchKey = '';
  products: SearchProduct[];
  filteredProducts: SearchProduct[] = [];
  @ViewChild('mobileNavMenu') mobileNavMenu: ElementRef<HTMLElement>;
  @ViewChild('top') top: ElementRef<HTMLElement>;
  @ViewChildren('nav') navs: ElementRef<HTMLElement>[];

  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    public categoryService: CategoryService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initProducts();
  }

  logout(): void {
    this.authService.logout();
    this.cartService.cart.next([]);
    this.authService.role.next(this.authService.getRole());
    this.router.navigateByUrl('main');
  }

  navigateToFilteredPage(category: string): void {
    if (document.body.clientWidth <= 650) {
      this.onMobileNavMenuClick();
    }
    this.router.navigateByUrl('filter?category=' + category);
  }

  isLinkActive(category: string): boolean {
    const queryParams = this.activatedRoute.queryParams as BehaviorSubject<any>;
    if (isPresent(queryParams.value.category) && queryParams.value.category.includes(category)) {
      return true;
    }
    return false;
  }

  onMobileNavMenuClick(): void {
    if (this.mobileNavMenu.nativeElement.style.width) {
      this.mobileNavMenu.nativeElement.style.width = null;
    } else {
      this.mobileNavMenu.nativeElement.style.width = 100 + '%';
    }
  }

  onKeyup(): void {
    this.filteredProducts = this.products
      .filter((product) => {
        const key = new RegExp(this.searchKey, 'gi');
        if (product.name.search(key) >= 0 || product.brand.search(key) >= 0) {
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
          this.cd.detectChanges();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  onSerchClick(): void {
    this.router.navigateByUrl('filter?searchKey=' + this.searchKey);
    this.searchKey = '';
    this.onKeyup();
  }

  onSelectionChange(product: SearchProduct): void {
    this.router.navigateByUrl('filter?searchKey=' + product.name);
    setTimeout(() => {
      this.searchKey = '';
      this.onKeyup();
    });
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
