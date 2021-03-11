import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MnMessageBoxComponent } from './component';

@NgModule({
  declarations: [MnMessageBoxComponent],
  imports: [BrowserModule, MatSelectModule, MatIconModule, MatButtonModule, MatRadioModule],
  exports: [MnMessageBoxComponent]
})
export class MnMessageBoxModule {}
