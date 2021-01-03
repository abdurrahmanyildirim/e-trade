import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { isPresent } from 'src/app/shared/util/common';
import { RegisterUser } from './model';

@Component({
  selector: 'app-register',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class RegisterComponent {
  form: FormGroup;
  user: RegisterUser;
  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      firstName: new FormControl(null, [
        Validators.required,
        Validators.nullValidator,
        Validators.maxLength(30)
      ]),
      lastName: new FormControl(null, [
        Validators.required,
        Validators.nullValidator,
        Validators.maxLength(30)
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.nullValidator
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.nullValidator,
        Validators.minLength(6)
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
        : { isMatching: false };
    };
  }

  register(): void {}
}
