import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { nullValidator } from 'src/app/shared/util/common';

@Component({
  selector: 'app-contact',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ContactComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      city: new FormControl('', [Validators.required, nullValidator()]),
      district: new FormControl('', [Validators.required, nullValidator()]),
      address: new FormControl('', [Validators.required, nullValidator()]),
      phone: new FormControl('', [Validators.required, nullValidator()])
    });
  }

  onKeypress(): void {
    setTimeout(() => {
      const phone = this.form.value.phone.split(' ').join('');
      let maskedPhone = '';
      for (let i = 0; i < phone.length; i++) {
        maskedPhone += phone[i];
        if (i === 2 || i === 5 || i === 7) {
          maskedPhone += ' ';
        }
      }
      this.form.patchValue({
        phone: maskedPhone
      });
    });
  }

  updateGeneralInfo(): void {}
}
