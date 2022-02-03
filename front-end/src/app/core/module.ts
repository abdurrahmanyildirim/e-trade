import { NgModule } from '@angular/core';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { DialogModule } from '../shared/components/dialog/module';
import { GTAGService } from '../shared/services/site/gtag';

const url = environment.production ? '' : 'http://localhost:4205';

const config: SocketIoConfig = { url, options: {} };

@NgModule({
  imports: [SocketIoModule.forRoot(config), DialogModule],
  providers: [GTAGService]
})
export class CoreModule {}
