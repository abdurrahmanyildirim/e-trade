import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/models/product';
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
  pageIndex: number;
  pageSize: number = 16;
  totalProductCount: number;
  mainSplash = true;
  showSplash = true;
  filter: Filter = {
    brands: new Map<string, string>(),
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
    private productService: ProductService,
    private filterFactory: FilterFactory
  ) {}

  ngOnInit(): void {
    const sub = this.activatedRoute.queryParams.subscribe((params) => {
      this.mainSplash = true;
      const key = 'category';
      this.initProductsByCategory(params[key]);
    });
    this.subs.add(sub);
  }

  initProductsByCategory(category: string): void {
    const sub = this.productService.productsByCategory(category).subscribe({
      next: (products) => {
        this.initBrands(products);
        this.totalProductCount = products.length;
        this.products = products.slice(0, this.pageSize);
        this.filterFactory.products = products;
        this.mainSplash = false;
        this.showSplash = false;
        setTimeout(() => {
          sub.unsubscribe();
        });
      },
      error: (err) => console.log(err)
    });
  }

  initBrands(products: Product[]): void {
    this.brands = [];
    products.forEach((product) => {
      if (this.brands.indexOf(product.brand) < 0) {
        this.brands.push(product.brand);
      }
    });
  }

  sortByType(sortType: SortTypes): void {
    this.showSplash = true;
    this.filter.sortType = sortType;
    const products = this.filterFactory.create(this.filter);
    this.totalProductCount = products.length;
    this.products = products.splice(0, this.pageSize);
    this.showSplash = false;
  }

  filterByBrand(brand: string): void {
    this.showSplash = true;
    if (this.filter.brands.has(brand)) {
      this.filter.brands.delete(brand);
    } else {
      this.filter.brands.set(brand, brand);
    }
    const products = this.filterFactory.create(this.filter);
    this.totalProductCount = products.length;
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
