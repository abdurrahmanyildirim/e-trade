import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StarComponent } from './component';

@NgModule({
  declarations: [StarComponent],
  imports: [CommonModule],
  exports: [StarComponent]
})
export class StarModule {}
