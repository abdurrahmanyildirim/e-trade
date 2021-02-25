import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NumericInputComponent } from './component';

@NgModule({
  declarations: [NumericInputComponent],
  imports: [FormsModule, BrowserModule],
  exports: [NumericInputComponent]
})
export class NumericInputModule {}
