import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth';
import { PageComponent } from './componet';

const routes: Routes = [
  {
    path: '',
    component: PageComponent,
    children: [
      {
        path: 'main',
        loadChildren: () => import('./main/module').then((m) => m.MainModule)
      },
      {
        path: 'product-detail/:id',
        loadChildren: () => import('./product-detail/module').then((m) => m.ProductDetailModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./orders/module').then((m) => m.OrdersModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'order-detail/:id',
        loadChildren: () => import('./order-detail/module').then((m) => m.OrderDetailModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'cart',
        loadChildren: () => import('./cart/module').then((m) => m.CartModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'user-info',
        loadChildren: () => import('./user-info/module').then((m) => m.UserInfoModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'contact',
        loadChildren: () => import('./contact/module').then((m) => m.ContactModule)
      },
      {
        path: 'auth',
        loadChildren: () => import('./auth/module').then((m) => m.AuthModule)
      },
      {
        path: 'filter',
        loadChildren: () => import('./filter/module').then((m) => m.FilterModule)
      },
      {
        path: 'regulations',
        loadChildren: () => import('./regulations/module').then((m) => m.RegulationsModule)
      },
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: '**', redirectTo: 'main', pathMatch: 'prefix' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule {}
