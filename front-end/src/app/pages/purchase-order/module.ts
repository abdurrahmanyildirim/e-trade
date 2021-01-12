import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { IconModule } from '@progress/kendo-angular-icons';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { PurchaseOrderComponent } from './component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [PurchaseOrderComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    InputsModule,
    ButtonModule,
    IconModule,
    IndicatorsModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  exports: [PurchaseOrderComponent]
})
export class PurchaseOrderModule {}
