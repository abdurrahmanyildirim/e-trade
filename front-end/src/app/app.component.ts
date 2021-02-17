import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Roles } from './shared/models/user';
import { AuthService } from './shared/services/rest/auth.service';
import { SplashService } from './shared/services/site/splash.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  roles = Roles;
  sub: Subscription;
  constructor(public splashService: SplashService, public authService: AuthService) {}

  ngOnDestroy(): void {}
}
