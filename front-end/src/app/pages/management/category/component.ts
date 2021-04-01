import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogType } from 'src/app/shared/components/dialog/component';
import { DialogService } from 'src/app/shared/components/dialog/service';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { Category } from 'src/app/shared/models/product';
import { CategoryService } from 'src/app/shared/services/rest/category';
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
    private screenHolder: ScreenHolderService,
    private dialogService: DialogService,
    public categoryService: CategoryService
  ) {}

  ngOnInit(): void {}

  insert(): void {
    this.screenHolder.show();
    this.productService.insertCategory(this.newCategory.toLocaleLowerCase().trim()).subscribe({
      next: (res) => {
        this.screenHolder.hide();
        this.snackbar.showInfo(res.message);
        this.newCategory = '';
        console.log(res);
        this.categoryService.categories.next(res.categories);
      },
      error: (err) => {
        this.screenHolder.hide();
        this.snackbar.showError(err.error.message);
      }
    });
  }

  remove(category: string): void {
    this.dialogService.confirm({
      acceptButton: 'Onayla',
      refuseButton: 'Vazgeç',
      desc:
        'Bu kategoriye bağlı bütün ürünler müşteri tarafından görüntülenemeyecek. Silmek istediğinize emin misiniz?',
      dialog: DialogType.Confirm,
      onClose: (result) => {
        if (!result) {
          return;
        }
        this.screenHolder.show();
        this.productService.removeCategory(category.toLocaleLowerCase().trim()).subscribe({
          next: (res) => {
            this.screenHolder.hide();
            this.snackbar.showInfo(res.message);
            this.categoryService.categories.next(res.categories);
          },
          error: (err) => {
            this.screenHolder.hide();
            this.snackbar.showError(err.error.message);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {}
}
