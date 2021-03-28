import { NgModule } from '@angular/core';
import { FilterComponent } from './component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'src/app/shared/components/card/module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getTurkishPaginatorIntl } from './paginator-intl';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [FilterComponent],
  imports: [
    MatCardModule,
    MatSelectModule,
    BrowserModule,
    FormsModule,
    MatButtonModule,
    CardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  providers: [{ provide: MatPaginatorIntl, useValue: getTurkishPaginatorIntl() }],
  exports: [FilterComponent]
})
export class FilterModule {}