import { NgModule } from '@angular/core';
import { HeaderComponent } from './component';
import { FormsModule } from '@angular/forms';
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { IconsModule } from '@progress/kendo-angular-icons';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    FormsModule,
    NavigationModule,
    IconsModule,
    IndicatorsModule,
    BrowserModule,
    RouterModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule {}
