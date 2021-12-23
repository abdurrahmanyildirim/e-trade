import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardModule } from 'src/app/shared/components/card/module';
import { MainComponent } from './component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [{ path: '', component: MainComponent }];
@NgModule({
  declarations: [MainComponent],
  imports: [RouterModule.forChild(routes), CommonModule, CardModule, CarouselModule, MatIconModule],
  exports: [MainComponent]
})
export class MainModule {}
