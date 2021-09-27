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
let key = '';
if (environment.production) {
  key = '399045451146-r6e03sbio9clb86ontnvrsk605fm623p.apps.googleusercontent.com';
} else {
  key = '539238066533-cmar8fngup5h8uj3rjd7481vkrcj5c4g.apps.googleusercontent.com';
}

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
            provider: new GoogleLoginProvider(key, googleLoginOptions)
          }
        ]
      } as SocialAuthServiceConfig
    }
  ]
})
export class CoreModule {}
