import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DialogType } from 'src/app/shared/components/dialog/component';
import { DialogService } from 'src/app/shared/components/dialog/service';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { AuthService } from 'src/app/shared/services/rest/auth/service';
import { CartService } from 'src/app/shared/services/rest/cart/service';
import { UserService } from 'src/app/shared/services/rest/user/service';
import { isPresent, nullValidator } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { City, PaymentReqResponse, UserInfo } from './model';

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
  cities: City[];
  selectedCity: City;
  errMsg: any;

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private userService: UserService,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private snackBarService: SnackbarService
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
    this.userService.getUser().subscribe({
      next: (info) => {
        this.contactInfo = info;
        this.initCities();
        this.initPersonelInfo();
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
    this.userService.getUser().subscribe({
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
      type: DialogType.SalesAndInformationContract
    });
  }

  purchaseOrder(): void {
    if (this.form.invalid) {
      return;
    }
    this.orderStatus = 0;
    const purchaseInfo = Object.assign({}, this.form.value);
    const subs = this.cartService
      .purchaseOrder(purchaseInfo)
      .pipe(delay(2500))
      .subscribe({
        next: (response: PaymentReqResponse) => {
          if (isDevMode()) {
            window.location.reload();
            return;
          }
          if (response.status !== 'failure') {
            window.open(response.paymentPageUrl, '_self', 'noopener,noreferrer');
          } else {
            this.orderStatus = 1;
            this.cd.detectChanges();
          }
        },
        error: (err) => {
          console.error(err);
          this.errMsg = err.error;
          this.orderStatus = 1;
          this.cd.detectChanges();
        }
      });
    this.subs.add(subs);
  }

  sendEmailActivationRequest(): void {
    const subs = this.authService.sendActivationMail().subscribe({
      next: () => {
        this.snackBarService.showSuccess('Aktivasyon maili tekrar gönderildi.');
      },
      error: (error) => {
        console.error(error);
        this.snackBarService.showError('Mail Gönderilemedi.');
      }
    });
    this.subs.add(subs);
  }

  initCities(): void {
    const sub = this.http.get<City[]>('assets/mock/cities.json').subscribe({
      next: (cities) => {
        this.cities = cities.sort((a, b) => a.city.localeCompare(b.city));
        this.contactInfo.city ? '' : (this.contactInfo.city = 'İstanbul');
        this.selectedCity = cities.find((c) => c.city === this.contactInfo.city);
        this.selectedCity.districts.sort((a, b) => a.localeCompare(b));
        this.createForm();
      },
      error: (err) => {
        console.error(err);
      }
    });
    this.subs.add(sub);
  }

  onCityChange(city: MatSelectChange): void {
    this.selectedCity = this.cities.slice().find((c) => c.city === city.value);
    this.selectedCity.districts.sort((a, b) => a.localeCompare(b));
    this.form.patchValue({ district: '' });
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
