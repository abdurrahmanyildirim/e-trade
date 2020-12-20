import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/rest/product.service';
import { isPresent } from 'src/app/shared/util/common';

@Component({
  selector: 'app-main',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class MainComponent implements OnDestroy {
  sub: Subscription;
  products: Product[];
  carousel = false;

  constructor(private productService: ProductService) {
    this.initProducts();
  }

  initProducts(): void {
    this.sub = this.productService.allProducts().subscribe({
      next: (results: Product[]) => {
        this.products = results;
      },
      error: (err) => console.log(err)
    });
  }

  ngOnDestroy(): void {
    if (isPresent(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
