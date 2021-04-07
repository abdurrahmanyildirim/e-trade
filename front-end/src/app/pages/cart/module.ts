import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { CartComponent } from './component';
import { CartDetailComponent } from './detail/component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NumericInputModule } from 'src/app/shared/components/numeric-input/module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ContactInfoComponent } from './contact-info/component';
import { ContractsComponent } from './contracts/component';
import { WithdrawalComponent } from 'src/app/shared/components/contracts/withdrawal/component';
import { InformationComponent } from 'src/app/shared/components/contracts/information/component';
import { SalesComponent } from 'src/app/shared/components/contracts/sales/component';
import { StateService } from './service';

const routes: Routes = [{ path: '', component: CartComponent }];

@NgModule({
  declarations: [
    CartComponent,
    CartDetailComponent,
    ContactInfoComponent,
    ContractsComponent,
    WithdrawalComponent,
    InformationComponent,
    SalesComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    RouterModule,
    NumericInputModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  providers: [StateService],
  exports: [CartComponent]
})
export class CartModule {}
