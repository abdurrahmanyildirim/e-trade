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
import { MatIconModule } from '@angular/material/icon';
import { ChangePasswordComponent } from './change-password/component';
import { UnAuthGuard } from './guard';
import { ActivateEmailComponent } from './activate-email/component';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule
} from 'angularx-social-login';
import { environment } from 'src/environments/environment';

const googleLoginOptions = {
  scope: 'profile email'
};

let googleKey = '';
if (environment.production) {
  googleKey = '539238066533-cmar8fngup5h8uj3rjd7481vkrcj5c4g.apps.googleusercontent.com';
} else {
  googleKey = '399045451146-r6e03sbio9clb86ontnvrsk605fm623p.apps.googleusercontent.com';
}

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [UnAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [UnAuthGuard] },
  { path: 'reset-request', component: ResetRequestComponent, canActivate: [UnAuthGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [UnAuthGuard] },
  { path: 'activate-email', component: ActivateEmailComponent, canActivate: [UnAuthGuard] },
  { path: '**', redirectTo: 'login', pathMatch: 'prefix' }
];
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ResetRequestComponent,
    ChangePasswordComponent,
    ActivateEmailComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    SocialLoginModule
  ],
  providers: [
    UnAuthGuard,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(googleKey, googleLoginOptions)
          }
        ]
      } as SocialAuthServiceConfig
    }
  ],
  exports: [LoginComponent, RegisterComponent]
})
export class AuthModule {}
