import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardModule } from 'src/app/components/card/module';
import { CustomCarouselModule } from 'src/app/components/carousel/module';
import { MainComponent } from './component';

@NgModule({
  declarations: [MainComponent],
  imports: [CustomCarouselModule, CommonModule, CardModule],
  exports: [MainComponent]
})
export class MainModule {}
