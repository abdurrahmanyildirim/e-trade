import { NgModule } from '@angular/core';
import { FilteredPageComponent } from './component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'src/app/components/card/module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getTurkishPaginatorIntl } from './paginator-intl';

@NgModule({
  declarations: [FilteredPageComponent],
  imports: [
    MatCardModule,
    MatSelectModule,
    BrowserModule,
    FormsModule,
    MatButtonModule,
    CardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatPaginatorModule
  ],
  providers: [{ provide: MatPaginatorIntl, useValue: getTurkishPaginatorIntl() }],
  exports: [FilteredPageComponent]
})
export class FilteredPageModule {}
