import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder.service';
import { nullValidator } from 'src/app/shared/util/common';

@Component({
  selector: 'app-contact',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ContactComponent implements OnInit {
  form: FormGroup;
  userContactInfo: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private screenHolder: ScreenHolderService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.initUserContactInfo();
  }

  initForm(): void {
    this.form = this.fb.group({
      city: new FormControl(this.userContactInfo.city, [Validators.required, nullValidator()]),
      district: new FormControl(this.userContactInfo.district, [
        Validators.required,
        nullValidator()
      ]),
      address: new FormControl(this.userContactInfo.address, [
        Validators.required,
        nullValidator()
      ]),
      phone: new FormControl(this.userContactInfo.phone, [
        Validators.required,
        Validators.maxLength(13),
        Validators.minLength(13),
        nullValidator()
      ])
    });
    this.onKeypress();
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

  initUserContactInfo(): void {
    this.authService.getContactInfo().subscribe({
      next: (contactInfo) => {
        this.userContactInfo = contactInfo;
        this.initForm();
      }
    });
  }

  update(): void {
    if (this.form.invalid) {
      return;
    }
    this.screenHolder.show();
    const info = Object.assign({}, this.form.value);
    info.phone = info.phone.split(' ').join('');
    this.authService.updateContactInfo(info).subscribe({
      next: (res) => {
        this.screenHolder.hide();
        this.snackbar.showSuccess('Bilgileriniz güncellendi.');
      },
      error: (err) => {
        console.log(err);
        this.screenHolder.hide();
        this.snackbar.showError('Güncelleme esnasında bir hata meydana geldi.');
        this.form.patchValue(this.userContactInfo);
      }
    });
  }
}
