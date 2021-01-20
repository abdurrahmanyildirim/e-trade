import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarouselComponent } from './component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [CarouselComponent],
  imports: [FormsModule, CommonModule, BrowserAnimationsModule],
  exports: [CarouselComponent]
})
export class CustomCarouselModule {}
