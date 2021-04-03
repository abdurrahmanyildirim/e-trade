import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/component';
import { RegisterComponent } from './register/component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { SocialService } from 'src/app/shared/services/site/social-auth';

const googleLoginOptions = {
  scope: 'profile email'
};

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];
@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  providers: [
    SocialService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '399045451146-r6e03sbio9clb86ontnvrsk605fm623p.apps.googleusercontent.com',
              googleLoginOptions
            )
          }
        ]
      } as SocialAuthServiceConfig
    }
  ],
  exports: [LoginComponent, RegisterComponent]
})
export class AuthModule {}
