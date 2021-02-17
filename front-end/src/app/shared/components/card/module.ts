import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent } from './component';
import { MatButtonModule } from '@angular/material/button';
import { StarModule } from '../star/module';

@NgModule({
  declarations: [CardComponent],
  imports: [CommonModule, RouterModule, MatButtonModule, StarModule],
  exports: [CardComponent]
})
export class CardModule {}
