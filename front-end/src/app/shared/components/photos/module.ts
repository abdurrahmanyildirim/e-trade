import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PhotosComponent } from './component';

@NgModule({
  declarations: [PhotosComponent],
  imports: [BrowserModule, FormsModule],
  exports: [PhotosComponent]
})
export class PhotosModule {}
