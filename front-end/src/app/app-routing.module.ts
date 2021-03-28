import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductDetailComponent } from './pages/product-detail/component';
import { MainComponent } from './pages/main/component';
import { CartComponent } from './pages/cart/component';
import { LoginComponent } from './pages/auth/login/component';
import { RegisterComponent } from './pages/auth/register/component';
import { OrdersComponent } from './pages/orders/component';
import { OrderDetailComponent } from './pages/order-detail/component';
import { FilterComponent } from './pages/filter/component';
import { AuthGuard } from './shared/guards/auth';
import { AdminGuard } from './shared/guards/admin';
import { ContactComponent } from './pages/contact/component';
import { PrivacyPolicyComponent } from './pages/regulations/privacy-policy/component';
import { SalesContractComponent } from './pages/regulations/sales-contract/component';
import { AboutComponent } from './pages/regulations/about/component';
import { UserInfoComponent } from './pages/user-info/component';
import { ManagementComponent } from './pages/management/component';

const routes: Routes = [
  { path: 'main', component: MainComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  {
    path: 'order-detail/:id',
    component: OrderDetailComponent,
    canActivate: [AuthGuard]
  },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'user-info', component: UserInfoComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'filter', component: FilterComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'sales-contract', component: SalesContractComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'management',
    component: ManagementComponent,
    loadChildren: () => import('./pages/management/module').then((m) => m.ManagementModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: '**', redirectTo: 'main', pathMatch: 'prefix' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
