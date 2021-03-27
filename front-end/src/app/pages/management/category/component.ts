import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { Category } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/rest/product.service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder.service';

@Component({
  selector: 'app-mn-category',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class MnCategoryComponent implements OnInit, OnDestroy {
  categories: Category[];
  newCategory = '';

  constructor(
    private router: Router,
    public productService: ProductService,
    private snackbar: SnackbarService,
    private screenHolder: ScreenHolderService
  ) {}

  ngOnInit(): void {
    this.initCategories();
  }

  initCategories(): void {
    this.productService.categories().subscribe({
      next: (categories) => {
        this.categories = categories.slice();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addNewCategory(): void {
    this.screenHolder.show();
    this.productService.addCategory(this.newCategory.toLocaleLowerCase()).subscribe({
      next: (res) => {
        this.screenHolder.hide();
        this.snackbar.showInfo(res.message);
        this.newCategory = '';
        this.initCategories();
      },
      error: (err) => {
        this.screenHolder.hide();
        this.snackbar.showError(err.error.message);
      }
    });
  }

  removeCategory(): void {}

  ngOnDestroy(): void {}
}
