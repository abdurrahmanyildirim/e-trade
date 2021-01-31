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
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { isPresent } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { Contact } from './model';

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
  timerSub: Subscription;

  constructor(private cartService: CartService, private router: Router, private fb: FormBuilder) {
    if (this.cartService.cart.value.length <= 0) {
      this.router.navigateByUrl('cart');
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.listenCart();
  }

  createForm(): void {
    this.form = this.fb.group({
      phone: new FormControl('', [
        Validators.required,
        this.nullValidator(),
        Validators.maxLength(13),
        Validators.minLength(13)
      ]),
      address: new FormControl('', [Validators.required, this.nullValidator()]),
      city: new FormControl('', [Validators.required, this.nullValidator()]),
      district: new FormControl('', [Validators.required, this.nullValidator()]),
      contractChecked: new FormControl(false, Validators.requiredTrue)
    });
  }

  nullValidator(): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value ? control.value + '' : '';
      return !!control.parent && !!control.parent.value && value.trim() !== ''
        ? null
        : { isNull: { value: false } };
    };
  }

  onKeypress() {
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

  listenCart(): void {
    this.cartService.cart.subscribe({
      next: (orders) => {
        this.orders = orders;
        this.calculateTotalCost();
      },
      error: (err) => console.log(err)
    });
  }

  calculateTotalCost(): void {
    let cost = 0;
    this.orders.forEach((order) => {
      cost += (order.price - order.price * order.discountRate) * order.quantity;
    });
    this.totalCost = cost;
  }

  purchaseOrder(): void {
    if (this.form.valid) {
      this.orderStatus = 0;
      this.form.patchValue({
        phone: this.form.value.phone.split(' ').join('')
      });
      const contactInfo = Object.assign({}, this.form.value);
      this.timerSub = timer(3000).subscribe({
        next: () => {
          this.orderSub = this.cartService.purchaseOrder(contactInfo).subscribe({
            next: (response) => {
              this.orderStatus = 1;
              this.cartService.initCart().subscribe();
            },
            error: (err) => {
              this.orderStatus = 2;
            }
          });
        }
      });
    }
  }

  navigateToCart(): void {
    this.router.navigateByUrl('cart');
  }

  ngOnDestroy(): void {
    if (isPresent(this.orderSub)) {
      this.orderSub.unsubscribe();
    }
    if (isPresent(this.timerSub)) {
      this.timerSub.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
