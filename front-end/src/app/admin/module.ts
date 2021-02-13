import { NgModule } from '@angular/core';
import { MnNewProductModule } from './new-product/module';
import { MnOrderDetailModule } from './order-detail/module';
import { MnOrdersModule } from './orders/module';

@NgModule({
  imports: [MnOrdersModule, MnOrderDetailModule, MnNewProductModule]
})
export class AdminModule {}
