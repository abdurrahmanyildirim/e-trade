import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { StorageKey } from 'src/app/shared/models/storage';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { LocalStorageService } from 'src/app/shared/services/site/local-storage.service';
import { isPresent } from 'src/app/shared/util/common';
import { LoginUser } from './model';

@Component({
  selector: 'app-login',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  user: LoginUser;
  subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private localStorage: LocalStorageService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  login(): void {
    if (this.form.valid) {
      this.user = Object.assign({}, this.form.value);
      const sub = this.authService.login(this.user).subscribe(
        (loginResponse) => {
          this.localStorage.setObject(StorageKey.User, loginResponse.info);
          this.authService.saveToken(loginResponse.token);
          this.authService.currentUser.next(loginResponse.info);
          this.authService.isAuth.next(true);
          this.cartService.initCart().subscribe(() => {
            this.localStorage.removeItem(StorageKey.Cart);
            this.authService.role.next(this.authService.getRole());
            this.location.back();
          });
          // this.alertifyService.success('Giriş yapıldı.');
        },
        (err) => {
          console.error(err.error);
          // this.alertifyService.alert('Hatalı giriş! Lütfen tekrar deneyiniz.');
          this.form.reset();
        }
      );
      this.subs.add(sub);
    }
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
