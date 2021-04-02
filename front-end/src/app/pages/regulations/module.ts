import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/component';
import { PrivacyPolicyComponent } from './privacy-policy/component';
import { SalesContractComponent } from './sales-contract/component';

const routes: Routes = [
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'sales-contract', component: SalesContractComponent },
  { path: 'about', component: AboutComponent }
];

@NgModule({
  declarations: [PrivacyPolicyComponent, SalesContractComponent, AboutComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [PrivacyPolicyComponent, SalesContractComponent, AboutComponent]
})
export class RegulationsModule {}
