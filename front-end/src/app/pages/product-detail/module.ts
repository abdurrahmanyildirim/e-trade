import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProductDetailComponent } from './component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { PhotosComponent } from './photos/component';
import { StarModule } from 'src/app/shared/components/star/module';

@NgModule({
  declarations: [ProductDetailComponent, PhotosComponent],
  imports: [CommonModule, MatInputModule, FormsModule, MatIconModule, MatButtonModule, StarModule],
  exports: [ProductDetailComponent]
})
export class ProductDetailModule {}
