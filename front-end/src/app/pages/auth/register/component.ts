import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { isPresent } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { RegisterUser } from './model';

@Component({
  selector: 'app-register',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  user: RegisterUser;
  sub: Subscription;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
        this.nullValidator()
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
        this.nullValidator()
      ]),
      email: new FormControl('', [Validators.required, Validators.email, this.nullValidator()]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        this.nullValidator()
      ]),
      confirmPassword: new FormControl(null, [this.matchingFields()])
    });
  }

  matchingFields(): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const matchKey = 'password';
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchKey].value
        ? null
        : { isMatching: { value: false } };
    };
  }

  nullValidator(): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value ? control.value : '';
      return !!control.parent && !!control.parent.value && value.trim() !== ''
        ? null
        : { isNull: { value: false } };
    };
  }

  register(): void {
    if (this.form.valid) {
      this.user = Object.assign({}, this.form.value);
      this.sub = this.authService.register(this.user).subscribe(
        (data) => {
          console.log(data);
          // this.authService.saveToken(data.token);
          // this.alertifyService.success('Giriş yapıldı.');
          this.router.navigateByUrl('login');
        },
        (err) => {
          console.log(err);
          this.form.reset();
          // this.alertifyService.alert('Hatalı giriş! Lütfen tekrar deneyiniz.');
          // this.loginForm.reset();
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (isPresent(this.sub)) {
      this.sub.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
