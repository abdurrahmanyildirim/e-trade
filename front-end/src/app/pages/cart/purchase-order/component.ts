import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { DialogType } from 'src/app/shared/components/dialog/component';
import { DialogService } from 'src/app/shared/components/dialog/service';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { isPresent, nullValidator } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { UserInfo } from './model';

@Component({
  selector: 'app-contact-info',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PurchaseOrderComponent implements OnInit, OnDestroy {
  orders = [];
  form: FormGroup;
  contactInfo: UserInfo;
  inited = false;
  orderInfo: any;
  orderStatus = -1;
  subs = new Subscription();

  constructor(
    private cartService: CartService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogService: DialogService,
    private snackbar: SnackbarService
  ) {
    this.orders = this.cartService.cart.value.map((order) => {
      return {
        productName: order.name,
        price: order.price,
        discountRate: order.discountRate,
        quantity: order.quantity
      };
    });
  }

  ngOnInit(): void {
    this.initContactInfo();
  }

  createForm(): void {
    this.form = this.fb.group({
      phone: new FormControl(this.contactInfo.phone, [
        Validators.required,
        nullValidator(),
        Validators.maxLength(13),
        Validators.minLength(13)
      ]),
      address: new FormControl(this.contactInfo.address, [Validators.required, nullValidator()]),
      city: new FormControl(this.contactInfo.city, [Validators.required, nullValidator()]),
      district: new FormControl(this.contactInfo.district, [Validators.required, nullValidator()]),
      contractsChecked: new FormControl(false, Validators.requiredTrue)
    });
    if (this.contactInfo.phone) {
      this.onKeypress();
    }
    setTimeout(() => {
      this.listenFormChange();
    });
    this.inited = true;
  }

  initContactInfo(): void {
    this.authService.getContactInfo().subscribe({
      next: (info) => {
        this.contactInfo = info;
        this.initPersonelInfo();
        this.createForm();
      }
    });
  }

  listenFormChange(): void {
    this.form.valueChanges.subscribe((formData) => {
      this.orderInfo.address = formData.address + ' ' + formData.district + '/' + formData.city;
      this.orderInfo.phone = formData.phone.split(' ').join('');
    });
  }

  initPersonelInfo(): void {
    this.authService.getUser().subscribe({
      next: (user) => {
        this.orderInfo = {
          name: user.firstName + ' ' + user.lastName,
          address:
            this.contactInfo.address +
            ' ' +
            this.contactInfo.district +
            '/' +
            this.contactInfo.city,
          date: new Date(),
          email: user.email,
          phone: this.contactInfo.phone
        };
      },
      error: (err) => {
        console.log(err);
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

  showContracts(): void {
    this.dialogService.contracts({
      acceptButton: 'Tamam',
      data: {
        orderInfo: this.orderInfo,
        orders: this.orders
      },
      desc: '',
      onClose: () => {},
      dialog: DialogType.SalesAndInformationContract
    });
  }

  purchaseOrder(): void {
    if (this.form.invalid) {
      return;
    }
    this.orderStatus = 0;
    const purchaseInfo = Object.assign({}, this.form.value);
    const subs1 = timer(3000).subscribe({
      next: () => {
        const subs2 = this.cartService.purchaseOrder(purchaseInfo).subscribe({
          next: (response) => {
            this.snackbar.showSuccess(
              'Siparişiniz Alındı. Siparişlerim ekranından siparişinizi kontrol edebilirsiniz.'
            );
            this.router.navigateByUrl('orders');
            this.cartService.cart.next([]);
          },
          error: (err) => {
            console.error(err);
            this.orderStatus = 1;
            // this.cd.detectChanges();
          }
        });
        this.subs.add(subs2);
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.subs.add(subs1);
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
