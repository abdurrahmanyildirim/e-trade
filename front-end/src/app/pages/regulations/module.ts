import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterContractModule } from 'src/app/shared/components/contracts/register/module';
import { AboutComponent } from './about/component';
import { RegisterContractPageComponent } from './register-contract/component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'register-contract', component: RegisterContractPageComponent }
];

@NgModule({
  declarations: [AboutComponent, RegisterContractPageComponent],
  imports: [RouterModule.forChild(routes), RegisterContractModule],
  exports: [AboutComponent, RegisterContractPageComponent]
})
export class RegulationsModule {}
