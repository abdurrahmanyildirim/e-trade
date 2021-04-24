import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Roles } from './shared/models/user';
import { AuthService } from './shared/services/rest/auth.service';
import { SplashService } from './shared/services/site/splash.service';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  roles = Roles;
  sub: Subscription;
  navigationProgress = false;

  constructor(
    public splashService: SplashService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listenNavigations();
  }

  scrollToTop(): void {
    document.body.scrollTop = 0;
  }

  listenNavigations(): void {
    this.router.events
      .pipe(
        filter(
          (e) =>
            e instanceof NavigationEnd ||
            e instanceof NavigationStart ||
            e instanceof NavigationCancel
        )
      )
      .subscribe({
        next: (event) => {
          if (event instanceof NavigationStart) {
            this.navigationProgress = true;
          }
          if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
            this.navigationProgress = false;
          }
        }
      });
  }

  ngOnDestroy(): void {}
}
