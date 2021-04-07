import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { nullValidator } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { StateService } from '../service';
import { UserInfo } from './model';

@Component({
  selector: 'app-contact-info',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ContactInfoComponent implements OnInit, OnDestroy {
  orders = [];
  form: FormGroup;
  userInfo: UserInfo;
  inited = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private stateService: StateService
  ) {
    if (this.cartService.cart.value.length <= 0) {
      this.router.navigateByUrl('cart');
    }
  }

  ngOnInit(): void {
    this.initUserInfo();
  }

  createForm(): void {
    this.form = this.fb.group({
      phone: new FormControl(this.userInfo.phone, [
        Validators.required,
        nullValidator(),
        Validators.maxLength(13),
        Validators.minLength(13)
      ]),
      address: new FormControl(this.userInfo.address, [Validators.required, nullValidator()]),
      city: new FormControl(this.userInfo.city, [Validators.required, nullValidator()]),
      district: new FormControl(this.userInfo.district, [Validators.required, nullValidator()])
    });
    if (this.userInfo.phone) {
      this.onKeypress();
    }
    this.stateService.contactInfoForm = this.form;
    this.inited = true;
  }

  initUserInfo(): void {
    this.authService.getContactInfo().subscribe({
      next: (info) => {
        this.userInfo = info;
        this.createForm();
      }
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

  ngOnDestroy(): void {
    ObjectHelper.removeReferances(this);
  }
}
