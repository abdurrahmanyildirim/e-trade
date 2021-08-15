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
import { ChangePasswordComponent } from './change-password/component';
import { UnAuthGuard } from './guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [UnAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [UnAuthGuard] },
  { path: 'reset-request', component: ResetRequestComponent, canActivate: [UnAuthGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [UnAuthGuard] }
];
@NgModule({
  declarations: [LoginComponent, RegisterComponent, ResetRequestComponent, ChangePasswordComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  providers: [UnAuthGuard],
  exports: [LoginComponent, RegisterComponent]
})
export class AuthModule {}
