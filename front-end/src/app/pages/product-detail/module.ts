import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProductDetailComponent } from './component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { StarModule } from 'src/app/shared/components/star/module';
import { PhotosModule } from 'src/app/shared/components/photos/module';

@NgModule({
  declarations: [ProductDetailComponent],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    StarModule,
    PhotosModule
  ],
  exports: [ProductDetailComponent]
})
export class ProductDetailModule {}
