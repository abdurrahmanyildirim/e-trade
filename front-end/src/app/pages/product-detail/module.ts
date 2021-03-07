import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProductDetailComponent } from './component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { StarModule } from 'src/app/shared/components/star/module';
import { PhotosModule } from 'src/app/shared/components/photos/module';
import { NumericInputModule } from 'src/app/shared/components/numeric-input/module';
import { MatTabsModule } from '@angular/material/tabs';
import { CommentsComponent } from './comments/component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [ProductDetailComponent, CommentsComponent],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    StarModule,
    PhotosModule,
    NumericInputModule,
    MatTabsModule,
    MatProgressBarModule,
    CarouselModule
  ],
  exports: [ProductDetailComponent]
})
export class ProductDetailModule {}
