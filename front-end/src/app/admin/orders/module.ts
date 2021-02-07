import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MnOrdersComponent } from './component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [MnOrdersComponent],
  imports: [BrowserModule, MatSelectModule, MatIconModule, MatButtonModule],
  exports: [MnOrdersComponent]
})
export class MnOrdersModule {}
