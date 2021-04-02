import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { Category, Product } from 'src/app/shared/models/product';
import { CategoryService } from 'src/app/shared/services/rest/category';
import { ProductService } from 'src/app/shared/services/rest/product.service';
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
export class FilterComponent implements OnInit, OnDestroy, AfterViewInit {
  subs = new Subscription();
  products: Product[];
  brands: string[];
  pageIndex: number;
  pageSize = 16;
  totalProductCount: number;
  mainSplash = true;
  showSplash = true;
  filter: Filter = {
    brands: new Map<string, string>(),
    category: '',
    sKey: '',
    sortType: SortType.none
  };
  SortType = SortType;
  @ViewChild('mobileFilters') mobileFilters: ElementRef<HTMLElement>;
  @ViewChild('mobileFiltersBody') mobileFiltersBody: ElementRef<HTMLElement>;
  touchSubs = new Subscription();
  touchStart: number;
  touchEnd: number;
  previousScrollTop = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    public productService: ProductService,
    private filterFactory: FilterFactory,
    public categoryService: CategoryService,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.filterFactory.products = this.productService.products.value.slice();
    this.initParams();
    if (document.body.clientWidth <= 650) {
      document.body.addEventListener('scroll', this.listenBodyScroll);
    }
  }

  listenBodyScroll(e: any): void {
    const filterPlace = document.getElementById('mobile-filter-button');
    if (document.body.scrollTop > this.previousScrollTop) {
      filterPlace.style.transition = 'transform 0.35s ease-in';
      filterPlace.style.transform = 'translateY(50px)';
    } else {
      filterPlace.style.transition = 'transform 0.35s ease-out';
      filterPlace.style.transform = 'translateY(0)';
    }
    this.previousScrollTop = document.body.scrollTop;
  }

  handleTouchAndClickEvents(): void {
    let subs = fromEvent(this.mobileFiltersBody.nativeElement, 'touchstart').subscribe(
      (event: TouchEvent) => {
        this.touchStart = event.changedTouches[0].screenX;
      }
    );
    this.touchSubs.add(subs);
    subs = fromEvent(this.mobileFiltersBody.nativeElement, 'touchend').subscribe(
      (event: TouchEvent) => {
        this.touchEnd = event.changedTouches[0].screenX;
        if (this.touchStart < this.touchEnd) {
          this.toggleMobileFilters();
        }
      }
    );
    this.touchSubs.add(subs);
    subs = fromEvent(this.mobileFiltersBody.nativeElement, 'click').subscribe(
      (event: MouseEvent) => {
        if (event.target === this.mobileFiltersBody.nativeElement) {
          this.toggleMobileFilters();
        }
      }
    );
    this.touchSubs.add(subs);
  }

  initParams(): void {
    const sub = this.activatedRoute.queryParams.subscribe((params) => {
      this.mainSplash = true;
      const key = 'category';
      const category = params[key];
      if (isPresent(category)) {
        this.filter.category = category;
      }
      const sKey = 'searchKey';
      const searchKey = params[sKey];
      if (isPresent(searchKey)) {
        this.filter.sKey = searchKey;
      }
      this.initProductsByFilter();
      this.mainSplash = false;
      this.cd.detectChanges();
    });
    this.subs.add(sub);
  }

  toggleMobileFilters(): void {
    if (this.mobileFilters.nativeElement.style.width) {
      this.mobileFilters.nativeElement.style.width = null;
      this.mobileFilters.nativeElement.style.padding = '0';
      if (isPresent(this.touchSubs)) {
        this.touchSubs.unsubscribe();
        this.touchSubs = new Subscription();
      }
      setTimeout(() => {
        this.mobileFiltersBody.nativeElement.style.width = null;
        document.body.scrollTop = 0;
      }, 350);
    } else {
      this.mobileFiltersBody.nativeElement.style.width = 100 + '%';
      this.mobileFilters.nativeElement.style.width = 60 + '%';
      this.mobileFilters.nativeElement.style.padding = '0 5px';
      this.handleTouchAndClickEvents();
    }
  }

  removeSearchKey(): void {
    this.filter.sKey = '';
    this.initProductsByFilter();
  }

  sortByType(sortType: SortType): void {
    this.showSplash = true;
    this.filter.sortType = sortType;
    this.initProductsByFilter();
  }

  filterByBrand(brand: string): void {
    this.showSplash = true;
    if (this.filter.brands.has(brand)) {
      this.filter.brands.delete(brand);
    } else {
      this.filter.brands.set(brand, brand);
    }
    this.initProductsByFilter();
  }

  filterByCategory(category: Category): void {
    this.showSplash = true;
    this.filter.category = category.name;
    this.filter.brands = new Map([]);
    this.initProductsByFilter();
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
