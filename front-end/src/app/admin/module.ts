import { NgModule } from '@angular/core';
import { MnOrderDetailModule } from './order-detail/module';
import { MnOrdersModule } from './orders/module';

@NgModule({
  imports: [MnOrdersModule, MnOrderDetailModule]
})
export class AdminModule {}
