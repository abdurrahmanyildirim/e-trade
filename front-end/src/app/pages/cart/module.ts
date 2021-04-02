import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { CartComponent } from './component';
import { CartDetailComponent } from './detail/component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NumericInputModule } from 'src/app/shared/components/numeric-input/module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PurchaseOrderComponent } from './purchase-order/component';

const routes: Routes = [{ path: 'cart', component: CartComponent }];

@NgModule({
  declarations: [CartComponent, CartDetailComponent, PurchaseOrderComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    RouterModule,
    NumericInputModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  exports: [CartComponent]
})
export class CartModule {}
