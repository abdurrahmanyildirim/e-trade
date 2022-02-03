import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/rest/auth/service';
import { SettingService } from 'src/app/shared/services/site/settings';
import { isPresent } from 'src/app/shared/util/common';

@Component({
  selector: 'app-activation-result',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ActivateEmailComponent implements OnInit, OnDestroy {
  subs: Subscription;
  isActivated: boolean;
  errorMsg: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private settingService: SettingService
  ) {}

  ngOnInit(): void {
    this.subs = this.activatedRoute.queryParams
      .pipe(
        switchMap((params) => {
          const key = 'v1';
          const token = params[key];
          return this.authService.activateEmail(token);
        }),
        switchMap((res) => this.settingService.initUserSettingsAfterLogin(res))
      )
      .subscribe({
        next: () => {
          this.isActivated = true;
        },
        error: (error) => {
          console.error(error);
          this.isActivated = false;
          this.errorMsg = error.toString();
        }
      });
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
