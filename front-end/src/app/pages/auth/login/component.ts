import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageKey } from 'src/app/shared/models/storage';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { isPresent } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
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
    private cartService: CartService
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
          window.localStorage.setItem(StorageKey.User, JSON.stringify(loginResponse.info));
          this.authService.saveToken(loginResponse.token);
          this.authService.currentUser.next(loginResponse.info);
          this.authService.isAuth.next(true);
          this.cartService.initCart().subscribe(() => {
            this.router.navigateByUrl('main');
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
    ObjectHelper.removeReferances(this);
  }
}
