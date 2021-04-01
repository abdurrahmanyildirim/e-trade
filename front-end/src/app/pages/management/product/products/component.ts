import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, Product } from 'src/app/shared/models/product';
import { CategoryService } from 'src/app/shared/services/rest/category';
import { ProductService } from 'src/app/shared/services/rest/product.service';

@Component({
  selector: 'app-mn-products',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class MnProductsComponent implements OnInit, OnDestroy {
  products: Product[];
  currentList: Product[];
  currentCategory: Category;

  constructor(
    private router: Router,
    public productService: ProductService,
    public categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.currentCategory = this.categoryService.categories.value[0];
    this.initProducts();
  }

  initProducts(): void {
    this.productService.allProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.initCurrentList();
      }
    });
  }

  initCurrentList(): void {
    this.currentList = this.products
      .filter((product) => product.category === this.currentCategory.name)
      .slice();
  }

  navigateToDetail(id: string): void {
    this.router.navigateByUrl('management/product-detail/' + id);
  }

  ngOnDestroy(): void {}
}
