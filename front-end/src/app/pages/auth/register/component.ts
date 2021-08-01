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
import { DialogType } from 'src/app/shared/components/dialog/component';
import { DialogService } from 'src/app/shared/components/dialog/service';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { AuthService } from 'src/app/shared/services/rest/auth/service';
import { SettingService } from 'src/app/shared/services/site/settings';
import { isPresent, nullValidator } from 'src/app/shared/util/common';
import { RegisterUser } from './model';

@Component({
  selector: 'app-register',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  user: RegisterUser;
  subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: SnackbarService,
    private settingService: SettingService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    if (this.authService.loggedIn()) {
      this.router.navigateByUrl('main');
    }
    this.createForm();
  }

  authWithGoogle(): void {
    const subs = this.authService.signInWithGoogle().subscribe({
      next: (res) => {
        this.settingService.initUserSettingsAfterLogin(res);
      },
      error: (err) => {
        console.log(err);
        this.snackBar.showError('Beklenmeyen bir hata meydana geldi. Tekrar deneyiniz.');
      }
    });
    this.subs.add(subs);
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
      ])
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
      const subs = this.authService.register(this.user).subscribe(
        (data) => {
          this.snackBar.showSuccess('Üyelik işlemleri yapıldı.');
          this.router.navigateByUrl('login');
        },
        (err) => {
          console.log(err);
          this.snackBar.showError('Bir hata meydana geldi. Lütfen bilgilerinizi kontrol ediniz!');
          this.form.reset();
          this.form.patchValue({
            password: ''
          });
        }
      );
      this.subs.add(subs);
    }
  }

  showContracts(): void {
    this.dialogService.contracts({
      acceptButton: 'Tamam',
      desc: '',
      type: DialogType.RegisterContract,
      onClose: (result) => {}
    });
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
