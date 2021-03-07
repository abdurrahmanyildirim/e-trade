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
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { isPresent, nullValidator } from 'src/app/shared/util/common';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
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
      firstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
        nullValidator()
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
        nullValidator()
      ]),
      email: new FormControl('', [Validators.required, Validators.email, nullValidator()]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        nullValidator()
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

  register(): void {
    if (this.form.valid) {
      this.user = Object.assign({}, this.form.value);
      this.authService.register(this.user).subscribe(
        (data) => {
          this.snackBar.showSuccess('Üyelik işlemleri yapıldı.');
          this.router.navigateByUrl('login');
        },
        (err) => {
          console.log(err);
          this.snackBar.showError('Bir hata meydana geldi. Lütfen bilgilerinizi kontrol ediniz!');
          this.form.reset();
          this.form.patchValue({
            password: '',
            confirmPassword: ''
          });
        }
      );
    }
  }

  ngOnDestroy(): void {}
}
