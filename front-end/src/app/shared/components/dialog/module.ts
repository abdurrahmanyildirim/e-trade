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

@NgModule({
  declarations: [DialogComponent, CartWarningComponent, ContractsDiaologComponent],
  imports: [MatDialogModule, MatButtonModule, CommonModule, MatIconModule, ContractsModule],
  providers: [DialogService],
  exports: [DialogComponent]
})
export class DialogModule {}
