import { NgModule } from '@angular/core';
import { DialogComponent } from './component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogService } from './service';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [DialogComponent],
  imports: [MatDialogModule, MatButtonModule],
  providers: [DialogService],
  exports: [DialogComponent]
})
export class DialogModule {}
