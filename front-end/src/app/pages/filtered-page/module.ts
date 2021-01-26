import { NgModule } from '@angular/core';
import { FilteredPageComponent } from './component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'src/app/components/card/module';

@NgModule({
  declarations: [FilteredPageComponent],
  imports: [
    MatCardModule,
    MatSelectModule,
    BrowserModule,
    FormsModule,
    MatButtonModule,
    CardModule
  ],
  exports: [FilteredPageComponent]
})
export class FilteredPageModule {}
