import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminComponent } from './component';
import { OrdersComponent } from './orders/component';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { StarModule } from 'src/app/shared/components/star/module';
import { MatRadioModule } from '@angular/material/radio';
import { DialogModule } from 'src/app/shared/components/dialog/module';
import { EditorModule } from 'src/app/shared/components/editor/module';
import { RouterModule, Routes } from '@angular/router';
import { OrderDetailComponent } from './order-detail/component';
import { OtherComponent } from './other/component';
import { ProductsComponent } from './products/component';
import { ProductDetailComponent } from './product-detail/component';
import { NewProductComponent } from './new-product/component';
import { PhotoUploadComponent } from './new-product/photo-upload/component';
import { MessageBoxComponent } from './message-box/component';
import { CategoryComponent } from './category/component';
import { AdminGuard } from '../shared/guards/admin';
import { DbService } from '../shared/services/rest/db/service';
import { LogService } from '../shared/services/rest/log/service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'orders',
        component: OrdersComponent
      },
      {
        path: 'order-detail/:id',
        component: OrderDetailComponent
      },
      {
        path: 'other',
        component: OtherComponent
      },
      {
        path: 'products',
        component: ProductsComponent
      },
      {
        path: 'product-detail/:id',
        component: ProductDetailComponent
      },
      {
        path: 'new-product',
        component: NewProductComponent
      },
      {
        path: 'message-box',
        component: MessageBoxComponent
      },
      {
        path: 'category',
        component: CategoryComponent
      },
      { path: 'admin', redirectTo: 'orders', pathMatch: 'full' },
      { path: '**', redirectTo: 'orders', pathMatch: 'prefix' }
    ]
  }
];

@NgModule({
  declarations: [
    AdminComponent,
    OrdersComponent,
    OrderDetailComponent,
    OtherComponent,
    ProductsComponent,
    ProductDetailComponent,
    NewProductComponent,
    PhotoUploadComponent,
    MessageBoxComponent,
    CategoryComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatStepperModule,
    DragDropModule,
    MatRadioModule,
    StarModule,
    DialogModule,
    EditorModule,
    MatProgressBarModule
  ],
  providers: [{ provide: DbService }, { provide: LogService }]
})
export class AdminModule {}
