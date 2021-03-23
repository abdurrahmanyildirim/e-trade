import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { nullValidator } from 'src/app/shared/util/common';

@Component({
  selector: 'app-password-update',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PasswordUpdateComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      currentPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        nullValidator()
      ]),
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

  updatePassword(): void {}
}
