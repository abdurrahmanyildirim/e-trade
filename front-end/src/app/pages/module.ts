import { NgModule } from '@angular/core';
import { ProductDetailModule } from './product-detail/module';
import { MainModule } from './main/module';
import { CartModule } from './cart/module';
import { PurchaseOrderModule } from './purchase-order/module';

@NgModule({
  imports: [MainModule, ProductDetailModule, CartModule, PurchaseOrderModule]
})
export class PagesModule {}
