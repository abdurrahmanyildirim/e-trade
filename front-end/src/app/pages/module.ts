import { NgModule } from '@angular/core';
import { ProductDetailModule } from './product-detail/module';
import { MainModule } from './main/module';
import { CartModule } from './cart/module';
import { PurchaseOrderModule } from './purchase-order/module';
import { AuthModule } from './auth/module';
import { OrdersModule } from './orders/module';

@NgModule({
  imports: [
    MainModule,
    ProductDetailModule,
    CartModule,
    PurchaseOrderModule,
    AuthModule,
    OrdersModule
  ]
})
export class PagesModule {}
