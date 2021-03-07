import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardModule } from 'src/app/shared/components/card/module';
import { MainComponent } from './component';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, CardModule, CarouselModule],
  exports: [MainComponent]
})
export class MainModule {}
