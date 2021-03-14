import { NgModule } from '@angular/core';
import { AboutComponent } from './about/component';
import { PrivacyPolicyComponent } from './privacy-policy/component';
import { SalesContractComponent } from './sales-contract/component';

@NgModule({
  declarations: [PrivacyPolicyComponent, SalesContractComponent, AboutComponent],
  exports: [PrivacyPolicyComponent, SalesContractComponent, AboutComponent]
})
export class RegulationsModule {}
