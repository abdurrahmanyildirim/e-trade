import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StarComponent } from './component';

@NgModule({
  declarations: [StarComponent],
  imports: [CommonModule],
  exports: [StarComponent]
})
export class StarModule {}
