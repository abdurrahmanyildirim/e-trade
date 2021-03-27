import { NgModule } from '@angular/core';
import { DialogComponent } from './component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogService } from './service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [DialogComponent],
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  providers: [DialogService],
  exports: [DialogComponent]
})
export class DialogModule {}
