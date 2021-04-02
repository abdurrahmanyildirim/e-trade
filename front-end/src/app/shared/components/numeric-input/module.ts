import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumericInputComponent } from './component';

@NgModule({
  declarations: [NumericInputComponent],
  imports: [FormsModule, CommonModule],
  exports: [NumericInputComponent]
})
export class NumericInputModule {}
