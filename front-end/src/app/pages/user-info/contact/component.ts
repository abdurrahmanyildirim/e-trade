import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { UserService } from 'src/app/shared/services/rest/user/service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder.service';
import { nullValidator } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';

@Component({
  selector: 'app-contact',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ContactComponent implements OnInit, OnDestroy {
  form: FormGroup;
  userContactInfo: any;

  constructor(
    private fb: FormBuilder,
    private screenHolder: ScreenHolderService,
    private snackbar: SnackbarService,
    private userService: UserService
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
    this.userService.getContactInfo().subscribe({
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
    this.userService.updateContactInfo(info).subscribe({
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

  ngOnDestroy(): void {
    ObjectHelper.removeReferances(this);
  }
}
