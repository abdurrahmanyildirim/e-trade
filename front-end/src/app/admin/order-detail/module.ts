import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MnOrderDetailComponent } from './component';

@NgModule({
  declarations: [MnOrderDetailComponent],
  imports: [BrowserModule, MatSelectModule, MatIconModule, MatButtonModule],
  exports: [MnOrderDetailComponent]
})
export class MnOrderDetailModule {}
