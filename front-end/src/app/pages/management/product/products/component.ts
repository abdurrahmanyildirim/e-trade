import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { BasePageDirective } from 'src/app/pages/base-page.component';
import { PageSelector } from 'src/app/pages/model';
import { Product } from 'src/app/shared/models/product';
import { CategoryService } from 'src/app/shared/services/rest/category/service';
import { ProductService } from 'src/app/shared/services/rest/product/service';
import { StateService } from 'src/app/shared/services/site/state';
import { MnProductsState } from './state';

@Component({
  selector: 'app-mn-products',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MnProductsComponent
  extends BasePageDirective<MnProductsState>
  implements OnInit, OnDestroy
{
  products: Product[];
  currentList: Product[];

  constructor(
    private router: Router,
    public productService: ProductService,
    public categoryService: CategoryService,
    protected stateService: StateService,
    private cd: ChangeDetectorRef
  ) {
    super(stateService);
    this.selector = PageSelector.AppMnProducts;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initProducts();
  }

  initProducts(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.filterProducts();
      }
    });
  }

  onSelectionChange(category: MatSelectChange): void {
    this.state.category = category.value;
    this.saveState();
    this.filterProducts();
  }

  filterProducts(): void {
    this.currentList = this.products
      .filter((product) => product.category === this.state.category)
      .slice();
    this.cd.detectChanges();
  }

  navigateToDetail(id: string): void {
    this.router.navigateByUrl('management/product-detail/' + id);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
