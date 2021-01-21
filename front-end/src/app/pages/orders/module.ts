import { NgModule } from '@angular/core';
import { OrdersComponent } from './component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [OrdersComponent],
  imports: [MatCardModule],
  exports: [OrdersComponent]
})
export class OrdersModule {}
