import { NgModule } from '@angular/core';
import { DialogComponent } from './component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogService } from './service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CartWarningComponent } from './cart-warning/component';
import { ContractsDiaologComponent } from './contracts/component';
import { ContractsModule } from '../contracts/module';
import { RegisterContractModule } from '../contracts/register/module';
import { SalesContractModule } from '../contracts/sales/module';
import { InformationContractModule } from '../contracts/information/module';

@NgModule({
  declarations: [DialogComponent, CartWarningComponent, ContractsDiaologComponent],
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    ContractsModule,
    RegisterContractModule,
    SalesContractModule,
    InformationContractModule
  ],
  providers: [DialogService],
  exports: [DialogComponent]
})
export class DialogModule {}
