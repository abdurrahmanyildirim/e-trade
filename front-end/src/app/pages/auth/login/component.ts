import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { StorageKey } from 'src/app/shared/models/storage';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { LocalStorageService } from 'src/app/shared/services/site/local-storage.service';
import { LoginUser } from './model';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';

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
    private cartService: CartService,
    private localStorage: LocalStorageService,
    private location: Location,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    if (this.authService.loggedIn()) {
      this.router.navigateByUrl('main');
    }
    this.createForm();
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
          this.localStorage.setObject(StorageKey.User, loginResponse.info);
          this.authService.saveToken(loginResponse.token);
          this.authService.currentUser.next(loginResponse.info);
          this.authService.isAuth.next(true);
          this.cartService.init().subscribe(() => {
            this.localStorage.removeItem(StorageKey.Cart);
            this.authService.role.next(this.authService.getRole());
            this.location.back();
          });
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
