import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ContactComponent } from './component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ContactComponent],
  imports: [BrowserModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  exports: [ContactComponent]
})
export class ContactModule {}
