import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/rest/product.service';

@Component({
  selector: 'app-mn-products',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class MnProductsComponent implements OnInit, OnDestroy {
  products: Product[];
  currentList: Product[];
  categories: Category[];
  currentCategory: Category;

  constructor(private router: Router, public productService: ProductService) {}

  ngOnInit(): void {
    this.initProducts();
  }

  initProducts(): void {
    this.productService.allProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.initCategories();
      }
    });
  }

  initCurrentList(): void {
    this.currentList = this.products
      .filter((product) => product.category === this.currentCategory.name)
      .slice();
  }

  initCategories(): void {
    this.productService.categories().subscribe({
      next: (categories) => {
        this.currentCategory = categories[0];
        this.categories = categories.slice();
        this.initCurrentList();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  navigateToDetail(id: string): void {
    this.router.navigateByUrl('management/product-detail/' + id);
  }

  ngOnDestroy(): void {}
}
