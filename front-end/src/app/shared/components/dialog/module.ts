import { NgModule } from '@angular/core';
import { DialogComponent } from './component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogService } from './service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CartWarningComponent } from './cart-warning/component';
import { ContractsDiaologComponent } from './contracts/component';
import { RegisterContractModule } from '../contracts/register/module';
import { RatingDiaologComponent } from './rating/component';
import { ConfirmDialogComponent } from './confirm/component';
import { SalesContractModule } from '../contracts/sales/module';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { OrderUpdateDialogComponent } from './order-update/component';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    DialogComponent,
    CartWarningComponent,
    ContractsDiaologComponent,
    RatingDiaologComponent,
    ConfirmDialogComponent,
    OrderUpdateDialogComponent
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    RegisterContractModule,
    SalesContractModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  providers: [DialogService],
  exports: [DialogComponent]
})
export class DialogModule {}
