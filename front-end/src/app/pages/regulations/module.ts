import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterContractModule } from 'src/app/shared/components/contracts/register/module';
import { SalesContractModule } from 'src/app/shared/components/contracts/sales/module';
import { WithdrawalModule } from 'src/app/shared/components/contracts/withdrawal/module';
import { AboutComponent } from './about/component';
import { RegisterContractPageComponent } from './register-contract/component';
import { SalesContractPageComponent } from './sales-contract/component';
import { WithdrawalPageComponent } from './withdrawal/component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'register-contract', component: RegisterContractPageComponent },
  { path: 'withdrawal', component: WithdrawalPageComponent },
  { path: 'sales-contract', component: SalesContractPageComponent }
];

@NgModule({
  declarations: [
    AboutComponent,
    RegisterContractPageComponent,
    WithdrawalPageComponent,
    SalesContractPageComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    RegisterContractModule,
    WithdrawalModule,
    SalesContractModule
  ],
  exports: [AboutComponent, RegisterContractPageComponent]
})
export class RegulationsModule {}
