import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardModule } from 'src/app/shared/components/card/module';
import { MainComponent } from './component';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, CardModule],
  exports: [MainComponent]
})
export class MainModule {}
