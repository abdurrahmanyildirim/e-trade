import { NgModule } from '@angular/core';
import { OrdersComponent } from './component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [{ path: 'orders', component: OrdersComponent }];
@NgModule({
  declarations: [OrdersComponent],
  imports: [
    RouterModule.forChild(routes),
    MatCardModule,
    CommonModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [OrdersComponent]
})
export class OrdersModule {}
