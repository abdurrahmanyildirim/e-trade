import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MnProductDetailComponent } from './component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PhotosModule } from 'src/app/shared/components/photos/module';
import { StarModule } from 'src/app/shared/components/star/module';
import { DialogModule } from 'src/app/shared/components/dialog/module';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [MnProductDetailComponent],
  imports: [
    BrowserModule,
    DialogModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    PhotosModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    StarModule,
    MatMenuModule,
    MatRadioModule
  ],
  exports: [MnProductDetailComponent]
})
export class MnProductDetailModule {}
