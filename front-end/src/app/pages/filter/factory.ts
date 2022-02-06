import { Injectable } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { isPresent } from 'src/app/shared/util/common';
import { Filter, SortType } from './model';

@Injectable()
export class FilterFactory {
  products: Product[];
  brands: string[];
  create(filter: Filter): Product[] {
    let products = this.sortByType(filter.sortType);
    products = this.filterByCategory(products, filter);
    products = this.filterBySearchKey(products, filter);
    this.initBrands(products);
    products = this.filterByBrand(products, filter);
    return products;
  }

  private sortByType(sortType: string): Product[] {
    if (sortType === SortType.asc) {
      return this.products
        .slice()
        .sort(
          (a: Product, b: Product) =>
            a.price - a.price * a.discountRate - (b.price - b.price * b.discountRate)
        );
    } else if (sortType === SortType.desc) {
      return this.products
        .slice()
        .sort(
          (a: Product, b: Product) =>
            b.price - b.price * b.discountRate - (a.price - a.price * a.discountRate)
        );
    } else {
      return this.products.slice();
    }
  }

  private filterByBrand(products: Product[], filter: Filter): Product[] {
    if (filter.brands.length > 0) {
      const brands = filter.brands.split('-');
      return products.filter((product) => brands.includes(product.brand.toLocaleLowerCase()));
    }
    return products;
  }

  private filterByCategory(products: Product[], filter: Filter): Product[] {
    if (filter.category.length > 0) {
      return products.filter((product) => {
        const reg = new RegExp(filter.category, 'gi');
        if (product.category.search(reg) >= 0) {
          return product;
        }
      });
    }
    return products;
  }

  private filterBySearchKey(products: Product[], filter: Filter): Product[] {
    if (filter.searchKey.length > 0) {
      return products.filter((product) => {
        const reg = new RegExp(filter.searchKey, 'gi');
        if (product.name.search(reg) >= 0) {
          return product;
        }
      });
    }
    return products;
  }

  private initBrands(products: Product[]): void {
    this.brands = [];
    products.forEach((product) => {
      if (this.brands.indexOf(product.brand.toLocaleLowerCase()) < 0) {
        this.brands.push(product.brand.toLocaleLowerCase());
      }
    });
  }
}
