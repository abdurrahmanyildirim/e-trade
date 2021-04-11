import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterContractModule } from 'src/app/shared/components/contracts/register/module';
import { AboutComponent } from './about/component';
import { PrivacyPolicyComponent } from './privacy-policy/component';
import { RegisterContractPageComponent } from './register-contract/component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'register-contract', component: RegisterContractPageComponent }
];

@NgModule({
  declarations: [PrivacyPolicyComponent, AboutComponent, RegisterContractPageComponent],
  imports: [RouterModule.forChild(routes), RegisterContractModule],
  exports: [PrivacyPolicyComponent, AboutComponent, RegisterContractPageComponent]
})
export class RegulationsModule {}
