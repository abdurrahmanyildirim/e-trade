import { NgModule } from '@angular/core';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule
} from 'angularx-social-login';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { DialogModule } from '../shared/components/dialog/module';

const googleLoginOptions = {
  scope: 'profile email'
};

const url = environment.production ? '' : 'http://localhost:4205';

const config: SocketIoConfig = { url, options: {} };

@NgModule({
  imports: [SocketIoModule.forRoot(config), SocialLoginModule, DialogModule],
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
