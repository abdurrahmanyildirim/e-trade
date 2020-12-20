import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { CardComponent } from './component';

@NgModule({
  declarations: [CardComponent],
  imports: [CommonModule, RouterModule, ButtonModule],
  exports: [CardComponent]
})
export class CardModule {}
