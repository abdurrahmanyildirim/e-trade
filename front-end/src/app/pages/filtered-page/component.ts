import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category, Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/rest/product.service';
import { isPresent } from 'src/app/shared/util/common';
import { FilterFactory } from './factory';
import { Filter, SortType, SortTypes } from './model';

@Component({
  selector: 'app-filtered-page',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  viewProviders: [FilterFactory]
})
export class FilteredPageComponent implements OnInit, OnDestroy {
  subs = new Subscription();
  products: Product[];
  brands: string[];
  categories: Category[];
  pageIndex: number;
  pageSize = 16;
  totalProductCount: number;
  mainSplash = true;
  showSplash = true;
  filter: Filter = {
    brands: new Map<string, string>(),
    category: '',
    sKey: '',
    sortType: SortTypes.none
  };
  sortingTypes: SortType[] = [
    {
      key: SortTypes.none,
      text: 'Hiçbiri'
    },
    {
      key: SortTypes.asc,
      text: 'Artan Fiyat'
    },
    {
      key: SortTypes.desc,
      text: 'Azalan Fiyat'
    }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    public productService: ProductService,
    private filterFactory: FilterFactory
  ) {}

  ngOnInit(): void {
    this.initParams();
  }

  initParams(): void {
    const sub = this.activatedRoute.queryParams.subscribe((params) => {
      this.mainSplash = true;
      this.initCategories();
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
      this.initProducts();
    });
    this.subs.add(sub);
  }

  initProducts(): void {
    this.productService.products().subscribe({
      next: (products) => {
        this.filterFactory.products = products;
        const filteredProducts = this.filterFactory.create(this.filter);
        this.products = filteredProducts.slice(0, this.pageSize);
        this.totalProductCount = filteredProducts.length;
        this.brands = this.filterFactory.brands.slice();
        this.mainSplash = false;
        this.showSplash = false;
      }
    });
  }

  removeSearchKey(): void {
    this.filter.sKey = '';
    this.initProducts();
  }

  initCategories(): void {
    this.productService.categories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  sortByType(sortType: SortTypes): void {
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
    this.showSplash = false;
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
