import { NgModule } from '@angular/core';
import { OrdersComponent } from './component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [OrdersComponent],
  imports: [
    MatCardModule,
    MatSelectModule,
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [OrdersComponent]
})
export class OrdersModule {}
