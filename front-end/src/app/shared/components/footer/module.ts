import { NgModule } from '@angular/core';
import { FooterComponent } from './component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [FooterComponent],
  imports: [MatIconModule, RouterModule, BrowserModule],
  exports: [FooterComponent]
})
export class FooterModule {}
