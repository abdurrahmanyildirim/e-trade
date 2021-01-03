import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { CarouselComponent } from './component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [CarouselComponent],
  imports: [FormsModule, ScrollViewModule, CommonModule, CarouselModule, BrowserAnimationsModule],
  exports: [CarouselComponent]
})
export class CustomCarouselModule {}
