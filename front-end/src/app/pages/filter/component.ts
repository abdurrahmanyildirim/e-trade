import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category, Product } from 'src/app/shared/models/product';
import { CategoryService } from 'src/app/shared/services/rest/category/service';
import { ProductService } from 'src/app/shared/services/rest/product/service';
import { isPresent } from 'src/app/shared/util/common';
import { FilterFactory } from './factory';
import { Filter, SortType } from './model';

@Component({
  selector: 'app-filter',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  viewProviders: [FilterFactory],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit, OnDestroy {
  subs = new Subscription();
  products: Product[];
  brands: string[];
  pageIndex: number;
  pageSize = 16;
  totalProductCount: number;
  mainSplash = true;
  showSplash = true;
  filter: Filter = {
    brands: '',
    category: '',
    searchKey: '',
    sortType: SortType.none
  };
  SortType = SortType;
  previousScrollTop = 0;
  isMobileFilterActive = false;
  isMobile = false;
  @ViewChild('mobileFilters') mobileFilters: ElementRef<HTMLElement>;
  @ViewChild('overlay') overlay: ElementRef<HTMLElement>;
  @ViewChild('pagination') paginationRef: MatPaginator;

  constructor(
    private activatedRoute: ActivatedRoute,
    public productService: ProductService,
    private filterFactory: FilterFactory,
    public categoryService: CategoryService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    if (document.body.clientWidth <= 650) {
      this.isMobile = true;
      document.body.addEventListener('scroll', this.listenBodyScroll);
    }
  }

  ngOnInit(): void {
    this.filterFactory.products = this.productService.products.value.slice();
    this.listenRoute();
  }

  trackByFn(index: number, product: Product): string {
    return product._id;
  }

  listenBodyScroll(e: any): void {
    const filterPlace = document.getElementById('mobile-filter-button');
    if (document.body.scrollTop > this.previousScrollTop) {
      filterPlace.style.transform = 'translateY(51px)';
    } else {
      filterPlace.style.transform = 'translateY(0)';
    }
    this.previousScrollTop = document.body.scrollTop;
  }

  listenRoute(): void {
    const sub = this.activatedRoute.queryParams.subscribe((params) => {
      this.mainSplash = true;
      for (const key in this.filter) {
        if (Object.prototype.hasOwnProperty.call(this.filter, key) && isPresent(params[key])) {
          this.filter[key] = params[key];
        } else {
          this.filter[key] = '';
        }
      }
      this.initProductsByFilter();
      this.mainSplash = false;
      this.cd.detectChanges();
    });
    this.subs.add(sub);
  }

  toggleMobileFilters(): void {
    if (this.isMobileFilterActive) {
      this.hideMobileFilter();
    } else {
      this.overlay.nativeElement.style.display = 'block';
      this.mobileFilters.nativeElement.style.transform = 'translateX(0)';
    }
    this.isMobileFilterActive = !this.isMobileFilterActive;
  }

  hideMobileFilter(): void {
    this.isMobileFilterActive = false;
    this.mobileFilters.nativeElement.style.transform = 'translateX(100%)';
    this.overlay.nativeElement.style.display = 'none';
    document.body.scrollTop = 0;
  }

  removeSearchKey(): void {
    this.filter.searchKey = '';
    this.appendFiltersToRoute();
  }

  sortByType(sortType: SortType): void {
    this.showSplash = true;
    this.filter.sortType = sortType;
    this.appendFiltersToRoute();
  }

  filterByBrand(brand: string): void {
    this.showSplash = true;
    const hasBrand = this.filter.brands.includes(brand);
    this.filter.brands = hasBrand
      ? this.filter.brands
          .split('-')
          .filter((filterBrand) => filterBrand !== brand)
          .join('-')
      : this.filter.brands + '-' + brand;
    this.appendFiltersToRoute();
  }

  filterByCategory(category: Category): void {
    this.showSplash = true;
    this.filter.category = category.name;
    this.filter.brands = '';
    this.filter.sortType = SortType.none;
    this.appendFiltersToRoute();
  }

  appendFiltersToRoute(): void {
    this.router.navigateByUrl('filter?' + this.filterParams());
    if (isPresent(this.paginationRef)) {
      this.paginationRef.firstPage();
    }
  }

  private filterParams(): string {
    let params = '';
    if (this.filter.category.length > 0) {
      params += 'category=' + this.filter.category + '&';
    }
    if (this.filter.brands.length > 0) {
      params += 'brands=' + this.filter.brands + '&';
    }
    if (this.filter.searchKey.length > 0) {
      params += 'searchKey=' + this.filter.searchKey + '&';
    }
    if (this.filter.sortType.length > 0) {
      params += 'sortType=' + this.filter.sortType;
    }
    return params;
  }

  initProductsByFilter(): void {
    const products = this.filterFactory.create(this.filter);
    this.totalProductCount = products.length;
    this.brands = this.filterFactory.brands.slice();
    this.products = products.splice(0, this.pageSize);
    this.showSplash = false;
  }

  onPaginationChange(pagination: any): void {
    this.showSplash = true;
    const index = pagination.pageIndex;
    this.products = this.filterFactory
      .create(this.filter)
      .slice(index * this.pageSize, index * this.pageSize + this.pageSize);
    document.body.scrollTop = 0;
    this.showSplash = false;
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    document.body.removeEventListener('scroll', this.listenBodyScroll);
  }
}
