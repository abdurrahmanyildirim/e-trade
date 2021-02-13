import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MnNewProductComponent } from './component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MnPhotosComponent } from './photos/component';

@NgModule({
  declarations: [MnNewProductComponent, MnPhotosComponent],
  imports: [
    BrowserModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  exports: [MnNewProductComponent]
})
export class MnNewProductModule {}
