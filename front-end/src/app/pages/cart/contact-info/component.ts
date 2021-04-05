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
import { Subscription, timer } from 'rxjs';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { isPresent, nullValidator } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { Contact, UserInfo } from './model';

@Component({
  selector: 'app-contact-info',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ContactInfoComponent implements OnInit, OnDestroy {
  orderStatus = -1;
  orders = [];
  totalCost = 0;
  form: FormGroup;
  contactInfo: Contact;
  subs = new Subscription();
  userInfo: UserInfo;
  inited = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: SnackbarService
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
      district: new FormControl(this.userInfo.district, [Validators.required, nullValidator()]),
      contractChecked: new FormControl(false, Validators.requiredTrue)
    });
    if (this.userInfo.phone) {
      this.onKeypress();
    }
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

  purchaseOrder(): void {
    if (this.form.valid) {
      this.orderStatus = 0;
      this.form.patchValue({
        phone: this.form.value.phone.split(' ').join('')
      });
      const contactInfo = Object.assign({}, this.form.value);
      const subs = timer(3000).subscribe({
        next: () => {
          this.cartService.purchaseOrder(contactInfo).subscribe({
            next: (response) => {
              this.orderStatus = 1;
              this.snackbar.showSuccess(
                'Siparişiniz Alındı. Siparişlerim ekranından siparişinizi kontrol edebilirsiniz.'
              );
              this.cartService.cart.next([]);
              this.router.navigateByUrl('orders');
            },
            error: (err) => {
              console.error(err);
              this.orderStatus = 2;
            }
          });
        }
      });
      this.subs.add(subs);
    }
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}