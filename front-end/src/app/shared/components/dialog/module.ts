import { NgModule } from '@angular/core';
import { DialogComponent } from './component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogService } from './service';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [DialogComponent],
  imports: [MatDialogModule, MatButtonModule, BrowserModule],
  providers: [DialogService],
  exports: [DialogComponent]
})
export class DialogModule {}
