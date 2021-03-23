import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { nullValidator } from 'src/app/shared/util/common';

@Component({
  selector: 'app-general',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class GeneralComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
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
      email: new FormControl('', [Validators.required, Validators.email, nullValidator()])
    });
  }

  updateGeneralInfo(): void {}
}
