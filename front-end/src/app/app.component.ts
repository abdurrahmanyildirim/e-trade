import { Component } from '@angular/core';
import { ConfigService } from './shared/services/site/config.service';
import { SplashService } from './shared/services/site/splash.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public splashService: SplashService) {}
  title = 'e-trader';
}
