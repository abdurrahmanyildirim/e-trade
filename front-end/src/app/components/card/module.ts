import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent } from './component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [CardComponent],
  imports: [CommonModule, RouterModule, MatButtonModule],
  exports: [CardComponent]
})
export class CardModule {}
