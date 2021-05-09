import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Roles } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/rest/auth/service';
import { CartService } from 'src/app/shared/services/rest/cart/service';
import { ProductService } from 'src/app/shared/services/rest/product/service';
import { isPresent } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { SearchProduct } from './model';
import { phoneSidebarOpenClose } from './animation';
import { CategoryService } from '../../services/rest/category/service';

@Component({
  selector: 'app-header',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [phoneSidebarOpenClose]
})
export class HeaderComponent implements OnInit, OnDestroy {
  roles = Roles;
  subs = new Subscription();
  isSidebarOpen = false;
  searchKey = '';
  products: SearchProduct[];
  filteredProducts: SearchProduct[] = [];
  isMobile = document.body.clientWidth <= 650;
  @ViewChild('mobileNavMenu') mobileNavMenu: ElementRef<HTMLElement>;

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
      this.isSidebarOpen = !this.isSidebarOpen;
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
    const products = this.productService.products.value.slice();
    this.products = products.map((prod) => {
      return {
        name: prod.name,
        brand: prod.brand,
        _id: prod._id
      };
    });
    this.cd.detectChanges();
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
