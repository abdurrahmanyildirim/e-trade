import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Roles } from './shared/models/user';
import { SplashService } from './shared/services/site/splash.service';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPresent } from './shared/util/common';
import { ProgressBarMode } from '@angular/material/progress-bar/progress-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  sub: Subscription;
  navigationProgress = false;
  mode: ProgressBarMode = 'indeterminate';

  constructor(public splashService: SplashService, private router: Router) {}

  ngOnInit(): void {
    this.listenNavigations();
  }

  scrollToTop(): void {
    document.body.scrollTop = 0;
  }

  listenNavigations(): void {
    this.sub = this.router.events
      .pipe(
        filter(
          (e) =>
            e instanceof NavigationEnd ||
            e instanceof NavigationStart ||
            e instanceof NavigationCancel ||
            e instanceof NavigationError
        )
      )
      .subscribe({
        next: (e) => {
          setTimeout(() => {
            if (e instanceof NavigationStart) {
              this.navigationProgress = true;
            }
            if (
              e instanceof NavigationEnd ||
              e instanceof NavigationCancel ||
              e instanceof NavigationError
            ) {
              this.navigationProgress = false;
            }
          });
        }
      });
  }

  ngOnDestroy(): void {
    if (isPresent(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
