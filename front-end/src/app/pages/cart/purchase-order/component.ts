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
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { nullValidator } from 'src/app/shared/util/common';
import { Contact, UserInfo } from './model';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PurchaseOrderComponent implements OnInit, OnDestroy {
  orderStatus = -1;
  orders = [];
  totalCost = 0;
  form: FormGroup;
  contactInfo: Contact;
  orderSub: Subscription;
  userInfo: UserInfo;
  inited = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
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
      timer(3000)
        .pipe(first())
        .subscribe({
          next: () => {
            this.cartService.purchaseOrder(contactInfo).subscribe({
              next: (response) => {
                this.orderStatus = 1;
                timer(3000)
                  .pipe(first())
                  .subscribe(() => {
                    this.cartService.initCart().subscribe();
                  });
              },
              error: (err) => {
                this.orderStatus = 2;
              }
            });
          }
        });
    }
  }

  ngOnDestroy(): void {}
}
