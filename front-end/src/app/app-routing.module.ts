import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './pages/main/component';
import { AuthGuard } from './shared/guards/auth';
import { AdminGuard } from './shared/guards/admin';


const routes: Routes = [
  { path: 'main', component: MainComponent },
  {
    path: '',
    loadChildren: () => import('./pages/product-detail/module').then((m) => m.ProductDetailModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/orders/module').then((m) => m.OrdersModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./pages/order-detail/module').then((m) => m.OrderDetailModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./pages/cart/module').then((m) => m.CartModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./pages/user-info/module').then((m) => m.UserInfoModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./pages/contact/module').then((m) => m.ContactModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/auth/module').then((m) => m.AuthModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/filter/module').then((m) => m.FilterModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/regulations/module').then((m) => m.RegulationsModule)
  },
  {
    path: 'management',
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
