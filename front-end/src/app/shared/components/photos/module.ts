import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PhotosComponent } from './component';

@NgModule({
  declarations: [PhotosComponent],
  imports: [CommonModule],
  exports: [PhotosComponent]
})
export class PhotosModule {}
