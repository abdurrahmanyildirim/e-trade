import { NgModule } from '@angular/core';
import { ProductDetailModule } from './product-detail/module';
import { MainModule } from './main/module';
import { CartModule } from './cart/module';
import { AuthModule } from './auth/module';
import { OrdersModule } from './orders/module';
import { OrderDetailModule } from './order-detail/module';
import { FilterModule } from './filter/module';
import { ContactModule } from './contact/module';
import { UserInfoModule } from './user-info/module';
import { ManagementModule } from './management/module';

const modules = [
  MainModule,
  ProductDetailModule,
  CartModule,
  AuthModule,
  OrdersModule,
  OrderDetailModule,
  FilterModule,
  ContactModule,
  UserInfoModule,
  ManagementModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export class PagesModule {}
