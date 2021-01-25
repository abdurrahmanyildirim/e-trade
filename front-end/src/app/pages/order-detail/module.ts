import { NgModule } from '@angular/core';
import { OrderDetailComponent } from './component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [OrderDetailComponent],
  imports: [MatCardModule, MatSelectModule, BrowserModule, FormsModule, MatButtonModule],
  exports: [OrderDetailComponent]
})
export class OrderDetailModule {}
