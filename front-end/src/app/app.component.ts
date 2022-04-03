import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  sub: Subscription;
  navigationProgress = false;

  constructor(public splashService: SplashService, private router: Router) {}

  ngOnInit(): void {
    this.listenNavigations();
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
              setTimeout(() => {
                this.navigationProgress = false;
              }, 300);
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
