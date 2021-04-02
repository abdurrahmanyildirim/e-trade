import { NgModule } from '@angular/core';
import { ManagementComponent } from './component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MnOrdersComponent } from './order/orders/component';
import { CommonModule } from '@angular/common';
import { MnOrderDetailComponent } from './order/order-detail/component';
import { MnProductsComponent } from './product/products/component';
import { MnNewProductComponent } from './product/new-product/component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PhotoUploadComponent } from './product/new-product/photo-upload/component';
import { DialogModule } from 'src/app/shared/components/dialog/module';
import { StarModule } from 'src/app/shared/components/star/module';
import { MatRadioModule } from '@angular/material/radio';
import { MnProductDetailComponent } from './product/product-detail/component';
import { MnMessageBoxComponent } from './message-box/component';
import { MnCategoryComponent } from './category/component';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      { path: 'orders', component: MnOrdersComponent },
      { path: 'order-detail/:id', component: MnOrderDetailComponent },
      { path: 'products', component: MnProductsComponent },
      { path: 'new-product', component: MnNewProductComponent },
      { path: 'product-detail/:id', component: MnProductDetailComponent },
      { path: 'message-box', component: MnMessageBoxComponent },
      { path: 'category', component: MnCategoryComponent },
      { path: '', redirectTo: 'orders', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [
    ManagementComponent,
    MnOrdersComponent,
    MnOrderDetailComponent,
    MnProductsComponent,
    MnNewProductComponent,
    PhotoUploadComponent,
    MnProductDetailComponent,
    MnMessageBoxComponent,
    MnCategoryComponent
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
    DialogModule,
    StarModule
  ],
  exports: [ManagementComponent]
})
export class ManagementModule {}
