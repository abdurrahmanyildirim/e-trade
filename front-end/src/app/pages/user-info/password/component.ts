import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder.service';
import { nullValidator } from 'src/app/shared/util/common';

@Component({
  selector: 'app-password-update',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PasswordUpdateComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private screenHolder: ScreenHolderService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        nullValidator()
      ]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        nullValidator()
      ]),
      confirmPassword: new FormControl(null, [this.matchingFields()])
    });
  }

  matchingFields(): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const matchKey = 'newPassword';
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchKey].value
        ? null
        : { isMatching: { value: false } };
    };
  }

  update(): void {
    if (this.form.invalid) {
      return;
    }
    this.screenHolder.show();
    const info = Object.assign({}, this.form.value);
    this.authService.updatePassword(info).subscribe({
      next: (res) => {
        this.screenHolder.hide();
        this.snackbar.showSuccess('Şifreniz güncellendi.');
        this.form.reset();
        Object.keys(this.form.controls).forEach((key) => {
          this.form.controls[key].setErrors(null);
        });
      },
      error: (err) => {
        console.log(err);
        this.screenHolder.hide();
        this.snackbar.showError(err.error.message);
        this.form.reset();
      }
    });
  }
}
