import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { CartComponent } from './component';
import { CartDetailComponent } from './detail/component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NumericInputModule } from 'src/app/shared/components/numeric-input/module';

@NgModule({
  declarations: [CartComponent, CartDetailComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    RouterModule,
    NumericInputModule
  ],
  exports: [CartComponent]
})
export class CartModule {}
