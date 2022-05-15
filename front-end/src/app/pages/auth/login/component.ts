import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/rest/auth/service';
import { LoginUser } from './model';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { SettingService } from 'src/app/shared/services/site/settings';
import { Subscription } from 'rxjs';
import { isPresent } from 'src/app/shared/util/common';
import { switchMap } from 'rxjs/operators';
import { SocialService } from 'src/app/shared/services/site/social-auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  providers: [SocialService]
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  user: LoginUser;
  subs = new Subscription();
  isGoogleAuthActive = environment.isGoogleAuthActive;
  private socialService: SocialService;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: SnackbarService,
    private settingService: SettingService,
    private router: Router,
    private injector: Injector
  ) {
    if (this.isGoogleAuthActive) {
      this.socialService = this.injector.get(SocialService);
    }
  }

  ngOnInit(): void {
    this.createForm();
  }

  authWithGoogle(): void {
    const subs = this.socialService
      .signInWithGoogle()
      .pipe(switchMap((resp) => this.settingService.initUserSettingsAfterLogin(resp)))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('main');
        },
        error: (err) => {
          console.error(err.error);
          this.snackBar.showError('Beklenmeyen bir hata meydana geldi!');
          this.form.patchValue({
            password: ''
          });
        }
      });
    this.subs.add(subs);
  }

  createForm(): void {
    this.form = this.fb.group({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  login(): void {
    if (this.form.valid) {
      this.user = Object.assign({}, this.form.value);
      const subs = this.authService
        .login(this.user)
        .pipe(switchMap((resp) => this.settingService.initUserSettingsAfterLogin(resp)))
        .subscribe({
          next: () => {
            this.router.navigateByUrl('main');
          },
          error: (err) => {
            console.error(err.error);
            this.snackBar.showError('Girilen isim veya şifre hatalı!');
            this.form.patchValue({
              password: ''
            });
          }
        });
      this.subs.add(subs);
    }
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
