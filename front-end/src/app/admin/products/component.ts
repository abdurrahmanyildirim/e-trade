import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/models/product';
import { CategoryService } from 'src/app/shared/services/rest/category/service';
import { ProductService } from 'src/app/shared/services/rest/product/service';
import { StateService } from 'src/app/shared/services/site/state';
import { isPresent } from 'src/app/shared/util/common';
import { BaseAdminDirective } from '../base-admin.directive';
import { PageSelector, RouteCategory } from '../model';
import { AdminService } from '../service';
import { ProductsState } from './state';

@Component({
  selector: 'app-products',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent
  extends BaseAdminDirective<ProductsState>
  implements OnInit, OnDestroy
{
  products: Product[];
  currentList: Product[];
  subs = new Subscription();

  constructor(
    private router: Router,
    public productService: ProductService,
    public categoryService: CategoryService,
    protected stateService: StateService,
    private cd: ChangeDetectorRef,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute
  ) {
    super(stateService);
    this.selector = PageSelector.AppAdminProducts;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.listenRoute();
    this.initCategories();
    this.initProducts();
  }

  initProducts(): void {
    const subs = this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.filterProducts();
      }
    });
    this.subs.add(subs);
  }

  initCategories(): void {
    const categories = this.categoryService.categories.value.map((category) => {
      return {
        key: category.name,
        title: category.name,
        isActive: category.name === this.state.category
      };
    }) as RouteCategory[];
    this.adminService.routeInfo.next(categories);
  }

  listenRoute(): void {
    const subs = this.activatedRoute.queryParams.subscribe((params) => {
      // tslint:disable-next-line: no-string-literal
      const key = params['key'];
      if (isPresent(key) && key !== this.state.category) {
        this.state.category = key;
        this.saveState();
        this.filterProducts();
      }
    });
    this.subs.add(subs);
  }

  filterProducts(): void {
    this.currentList = this.products
      .filter((product) => product.category === this.state.category)
      .slice();
    this.cd.detectChanges();
  }

  navigateToDetail(id: string): void {
    this.router.navigateByUrl('admin/product-detail/' + id);
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    super.ngOnDestroy();
  }
}
