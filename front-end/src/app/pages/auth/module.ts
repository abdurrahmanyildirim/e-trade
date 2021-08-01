import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/component';
import { RegisterComponent } from './register/component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { ResetRequestComponent } from './reset-request/component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-request', component: ResetRequestComponent },
  { path: 'reset-password', component: RegisterComponent }
];
@NgModule({
  declarations: [LoginComponent, RegisterComponent, ResetRequestComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  exports: [LoginComponent, RegisterComponent]
})
export class AuthModule {}
