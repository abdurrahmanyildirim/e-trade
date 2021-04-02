import { NgModule } from '@angular/core';
import { OrderDetailComponent } from './component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: OrderDetailComponent
  }
];
@NgModule({
  declarations: [OrderDetailComponent],
  imports: [
    RouterModule.forChild(routes),
    MatCardModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [OrderDetailComponent]
})
export class OrderDetailModule {}
