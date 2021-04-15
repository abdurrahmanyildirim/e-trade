import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardModule } from 'src/app/shared/components/card/module';
import { MainComponent } from './component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: MainComponent }];
@NgModule({
  declarations: [MainComponent],
  imports: [RouterModule.forChild(routes), CommonModule, CardModule, CarouselModule],
  exports: [MainComponent]
})
export class MainModule {}
