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

const routes: Routes = [
  { path: 'main', component: MainComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'order-detail/:id', component: OrderDetailComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'cart', component: CartComponent },
  { path: 'purchase-order', component: PurchaseOrderComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'main', pathMatch: 'prefix' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
