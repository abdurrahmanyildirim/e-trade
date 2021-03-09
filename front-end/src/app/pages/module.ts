import { NgModule } from '@angular/core';
import { ProductDetailModule } from './product-detail/module';
import { MainModule } from './main/module';
import { CartModule } from './cart/module';
import { AuthModule } from './auth/module';
import { OrdersModule } from './orders/module';
import { OrderDetailModule } from './order-detail/module';
import { FilteredPageModule } from './filtered-page/module';
import { ContactModule } from './contact/module';

@NgModule({
  imports: [
    MainModule,
    ProductDetailModule,
    CartModule,
    AuthModule,
    OrdersModule,
    OrderDetailModule,
    FilteredPageModule,
    ContactModule
  ]
})
export class PagesModule {}
