import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { CarouselComponent } from './component';

@NgModule({
  declarations: [CarouselComponent],
  imports: [FormsModule, ScrollViewModule],
  exports: [CarouselComponent]
})
export class CarouselModule {}
