import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WithdrawalComponent } from './withdrawal/component';

@NgModule({
  declarations: [WithdrawalComponent],
  imports: [CommonModule],
  exports: [WithdrawalComponent]
})
export class ContractsModule {}
