import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Roles } from './shared/models/user';
import { AuthService } from './shared/services/rest/auth.service';
import { ConfigService } from './shared/services/site/config.service';
import { SplashService } from './shared/services/site/splash.service';
import { isPresent } from './shared/util/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  role: Roles;
  roles = Roles;
  sub: Subscription;
  constructor(public splashService: SplashService, private authService: AuthService) {}

  initRole(): void {
    this.sub = this.authService.role.subscribe((role) => {
      this.role = role;
    });
  }

  ngOnDestroy(): void {
    if (isPresent(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
