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
        Validators.maxLength(10),
        Validators.minLength(10)
      ]),
      address: new FormControl('', [Validators.required, this.nullValidator()]),
      city: new FormControl('', [Validators.required, this.nullValidator()]),
      district: new FormControl('', [Validators.required, this.nullValidator()]),
      contractChecked: new FormControl(false, Validators.required)
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
      cost += order.price * order.quantity * order.discountRate;
    });
    this.totalCost = cost;
  }

  purchaseOrder(): void {
    if (this.form.valid) {
      this.orderStatus = 0;
      const contactInfo = Object.assign({}, this.form.value);
      this.timerSub = timer(5000).subscribe({
        next: () => {
          this.orderSub = this.cartService.purchaseOrder(contactInfo).subscribe({
            next: (response) => {
              this.orderStatus = 1;
              this.cartService.initCart();
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
