import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { LoginUser } from './model';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { SettingService } from 'src/app/shared/services/site/settings';
import { SocialService } from 'src/app/shared/services/site/social-auth';

@Component({
  selector: 'app-login',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  user: LoginUser;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: SnackbarService,
    private settingService: SettingService,
    private socialService: SocialService
  ) {}

  ngOnInit(): void {
    if (this.authService.loggedIn()) {
      this.router.navigateByUrl('main');
    }
    this.createForm();
  }

  authWithGoogle(): void {
    this.socialService.signInWithGoogle().subscribe({
      next: (res) => {
        this.settingService.initUserSettingsAfterLogin(res);
      },
      error: (err) => {
        console.log(err);
        this.snackBar.showError('Beklenmeyen bir hata meydana geldi. Tekrar deneyiniz.');
      }
    });
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
      this.authService.login(this.user).subscribe(
        (loginResponse) => {
          this.settingService.initUserSettingsAfterLogin(loginResponse);
        },
        (err) => {
          console.error(err.error);
          this.snackBar.showError('Girilen isim veya şifre hatalı!');
          this.form.patchValue({
            password: ''
          });
        }
      );
    }
  }

  ngOnDestroy(): void {}
}
