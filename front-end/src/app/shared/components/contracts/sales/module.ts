import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SalesContractComponent } from './component';

@NgModule({
  declarations: [SalesContractComponent],
  imports: [CommonModule],
  exports: [SalesContractComponent]
})
export class SalesContractModule {}
