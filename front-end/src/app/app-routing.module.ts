import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductDetailComponent } from './pages/product-detail/component';
import { MainComponent } from './pages/main/component';
import { CartComponent } from './pages/cart/component';
import { PurchaseOrderComponent } from './pages/purchase-order/component';
import { LoginComponent } from './pages/auth/login/component';
import { RegisterComponent } from './pages/auth/register/component';
import { OrdersComponent } from './pages/orders/component';
import { OrderDetailComponent } from './pages/order-detail/component';
import { FilteredPageComponent } from './pages/filtered-page/component';
import { MnOrdersComponent } from './admin/orders/component';
import { MnOrderDetailComponent } from './admin/order-detail/component';
import { MnNewProductComponent } from './admin/new-product/component';
import { AuthGuard } from './shared/guards/auth';
import { AdminGuard } from './shared/guards/admin';
import { MnProductsComponent } from './admin/products/component';
import { MnProductDetailComponent } from './admin/product-detail/component';

const routes: Routes = [
  { path: 'main', component: MainComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  {
    path: 'order-detail/:id',
    component: OrderDetailComponent,
    canActivate: [AuthGuard]
  },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent },
  { path: 'purchase-order', component: PurchaseOrderComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'filtered-page', component: FilteredPageComponent },
  { path: 'mn-orders', component: MnOrdersComponent, canActivate: [AuthGuard, AdminGuard] },
  {
    path: 'mn-order-detail/:id',
    component: MnOrderDetailComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'mn-new-product',
    component: MnNewProductComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'mn-products',
    component: MnProductsComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'mn-product-detail/:id',
    component: MnProductDetailComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: '**', redirectTo: 'main', pathMatch: 'prefix' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
