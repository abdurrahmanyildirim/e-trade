import { NgModule } from '@angular/core';
import { UserInfoComponent } from './component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GeneralComponent } from './general/component';
import { PasswordUpdateComponent } from './password/component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

const routes: Routes = [{ path: '', component: UserInfoComponent }];
@NgModule({
  declarations: [UserInfoComponent, GeneralComponent, PasswordUpdateComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  exports: [UserInfoComponent]
})
export class UserInfoModule {}
