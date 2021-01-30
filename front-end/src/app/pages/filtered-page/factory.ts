import { Injectable } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { Filter, SortTypes } from './model';

@Injectable()
export class FilterFactory {
  products: Product[];
  create(filter: Filter): Product[] {
    let products = this.sortByType(filter.sortType);
    products = this.filterByBrand(products, filter);
    return products;
  }

  private sortByType(sortType: string): Product[] {
    if (sortType === SortTypes.asc) {
      return this.products
        .slice()
        .sort(
          (a: Product, b: Product) =>
            a.price - a.price * a.discountRate - (b.price - b.price * b.discountRate)
        );
    } else if (sortType === SortTypes.desc) {
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
    if (filter.brands.size <= 0) {
      return products;
    } else {
      return products.filter((product) => filter.brands.has(product.brand));
    }
  }
}
