import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { IconModule } from '@progress/kendo-angular-icons';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { CartComponent } from './component';
import { CartDetailComponent } from './detail/component';

@NgModule({
  declarations: [CartComponent, CartDetailComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    InputsModule,
    ButtonModule,
    IconModule,
    IndicatorsModule,
    RouterModule
  ],
  exports: [CartComponent]
})
export class CartModule {}
