import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MnNewProductComponent } from './component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PhotoUploadComponent } from './photo-upload/component';

@NgModule({
  declarations: [MnNewProductComponent, PhotoUploadComponent],
  imports: [
    BrowserModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatStepperModule,
    DragDropModule
  ],
  exports: [MnNewProductComponent]
})
export class MnNewProductModule {}
