import { NgModule } from '@angular/core';
import { MnMessageBoxModule } from './message-box/module';
import { MnNewProductModule } from './new-product/module';
import { MnOrderDetailModule } from './order-detail/module';
import { MnOrdersModule } from './orders/module';
import { MnProductDetailModule } from './product-detail/module';
import { MnProductsModule } from './products/module';

@NgModule({
  imports: [
    MnOrdersModule,
    MnOrderDetailModule,
    MnNewProductModule,
    MnProductsModule,
    MnProductDetailModule,
    MnMessageBoxModule
  ]
})
export class AdminModule {}
