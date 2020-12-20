import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { ProductDetailComponent } from './component';

@NgModule({
  declarations: [ProductDetailComponent],
  imports: [ScrollViewModule, InputsModule, CommonModule, ButtonModule],
  exports: [ProductDetailComponent]
})
export class ProductDetailModule {}
