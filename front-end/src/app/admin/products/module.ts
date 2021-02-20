import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MnProductsComponent } from './component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [MnProductsComponent],
  imports: [BrowserModule, MatSelectModule, MatIconModule, MatButtonModule],
  exports: [MnProductsComponent]
})
export class MnProductsModule {}
