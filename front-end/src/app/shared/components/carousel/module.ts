import { NgModule } from '@angular/core';
import { CarouselComponent } from './component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CarouselComponent],
  imports: [CommonModule],
  exports: [CarouselComponent]
})
export class CarouselModule {}
