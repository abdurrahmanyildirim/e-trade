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
import { BehaviorSubject } from 'rxjs';
import { Roles } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/rest/auth/service';
import { CartService } from 'src/app/shared/services/rest/cart/service';
import { ProductService } from 'src/app/shared/services/rest/product/service';
import { isPresent } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { SearchProduct } from './model';
import { phoneSidebarOpenClose } from './animation';
import { CategoryService } from '../../services/rest/category/service';
import { MobileDetectionService } from '../../services/site/mobile-detection';

@Component({
  selector: 'app-header',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [phoneSidebarOpenClose]
})
export class HeaderComponent implements OnInit, OnDestroy {
  roles = Roles;
  searchKey = '';
  products: SearchProduct[];
  filteredProducts: SearchProduct[] = [];
  isSideBarActive = false;
  @ViewChild('overlay') overlay: ElementRef<HTMLElement>;
  @ViewChild('mobileMenuEl') mobileMenuEl: ElementRef<HTMLElement>;

  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    public categoryService: CategoryService,
    private cd: ChangeDetectorRef,
    public mobileDet: MobileDetectionService
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
    if (this.mobileDet.isMobile.value) {
      this.toggleMenu();
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
    if (this.searchKey.trim().length > 0) {
      this.router.navigateByUrl('filter?searchKey=' + this.searchKey);
      this.searchKey = '';
      this.onKeyup();
    }
  }

  onSelectionChange(product: SearchProduct): void {
    this.router.navigateByUrl('filter?searchKey=' + product.name);
    setTimeout(() => {
      this.searchKey = '';
      this.onKeyup();
    });
  }

  toggleMenu(): void {
    if (this.mobileDet.isMobile.value) {
      this.isSideBarActive = !this.isSideBarActive;
    }
  }

  ngOnDestroy(): void {
    ObjectHelper.removeReferances(this);
  }
}
