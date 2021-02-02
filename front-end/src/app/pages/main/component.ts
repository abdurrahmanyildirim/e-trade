import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/rest/product.service';
import { isPresent } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';

@Component({
  selector: 'app-main',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  sub: Subscription;
  products: Product[];
  carousel = false;
  discounted: Product[];
  mostLiked: Product[];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.initProducts();
  }

  initProducts(): void {
    this.sub = this.productService.allProducts().subscribe({
      next: (results) => {
        this.products = results;
        this.initDiscountedProducts();
        this.initMostLiked();
      },
      error: (err) => console.log(err)
    });
  }

  initDiscountedProducts(): void {
    this.discounted = this.products.filter((product) => product.discountRate > 0).slice(0, 5);
  }

  initMostLiked(): void {
    this.mostLiked = this.products.sort((a: Product, b: Product) => b.rate - a.rate).slice(0, 5);
  }

  ngOnDestroy(): void {
    if (isPresent(this.sub)) {
      this.sub.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
