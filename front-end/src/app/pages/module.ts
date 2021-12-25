import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FooterModule } from '../shared/components/footer/module';
import { HeaderModule } from '../shared/components/header/module';
import { PageComponent } from './componet';
import { PageRoutingModule } from './routing.module';

@NgModule({
  declarations: [PageComponent],
  imports: [HeaderModule, FooterModule, PageRoutingModule, CommonModule]
})
export class PageModule {}
