import { NgModule } from '@angular/core';
import { GoogleLoginProvider, SocialAuthServiceConfig } from 'angularx-social-login';
import { DialogModule } from '../shared/components/dialog/module';

const googleLoginOptions = {
  scope: 'profile email'
};

@NgModule({
  imports: [DialogModule],
  providers: [
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
  ]
})
export class CoreModule {}
