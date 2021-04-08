import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InformationComponent } from './information/component';
import { SalesComponent } from './sales/component';
import { WithdrawalComponent } from './withdrawal/component';

@NgModule({
  declarations: [SalesComponent, InformationComponent, WithdrawalComponent],
  imports: [CommonModule],
  exports: [SalesComponent, InformationComponent, WithdrawalComponent]
})
export class ContractsModule {}
