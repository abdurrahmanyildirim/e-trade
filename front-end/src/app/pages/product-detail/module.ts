import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProductDetailComponent } from './component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { StarModule } from 'src/app/shared/components/star/module';
import { NumericInputModule } from 'src/app/shared/components/numeric-input/module';
import { MatTabsModule } from '@angular/material/tabs';
import { CommentsComponent } from './comments/component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RouterModule, Routes } from '@angular/router';
import { PhotosModule } from 'src/app/shared/components/photos/module';
import { CardModule } from 'src/app/shared/components/card/module';

const routes: Routes = [{ path: '', component: ProductDetailComponent }];
@NgModule({
  declarations: [ProductDetailComponent, CommentsComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    StarModule,
    PhotosModule,
    NumericInputModule,
    MatTabsModule,
    CardModule,
    CarouselModule
  ],
  exports: [ProductDetailComponent]
})
export class ProductDetailModule {}
