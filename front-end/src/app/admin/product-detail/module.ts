import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MnProductDetailComponent } from './component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [MnProductDetailComponent],
  imports: [BrowserModule, MatSelectModule, MatIconModule, MatButtonModule],
  exports: [MnProductDetailComponent]
})
export class MnProductDetailModule {}
