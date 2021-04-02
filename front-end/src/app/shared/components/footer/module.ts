import { NgModule } from '@angular/core';
import { FooterComponent } from './component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [FooterComponent],
  imports: [MatIconModule, RouterModule, CommonModule],
  exports: [FooterComponent]
})
export class FooterModule {}
