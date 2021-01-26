import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/rest/product.service';

@Component({
  selector: 'app-filtered-page',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class FilteredPageComponent implements OnInit {
  subs = new Subscription();
  products: Product[];
  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    const sub = this.activatedRoute.queryParams.subscribe((params) => {
      const key = 'category';
      this.initProductsByCategory(params[key]);
    });
    this.subs.add(sub);
  }

  initProductsByCategory(category: string): void {
    this.productService.productsByCategory(category).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (err) => console.log(err)
    });
  }
}
