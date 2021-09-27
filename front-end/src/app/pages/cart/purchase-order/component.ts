import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DialogType } from 'src/app/shared/components/dialog/component';
import { DialogService } from 'src/app/shared/components/dialog/service';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
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

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private userService: UserService,
    private http: HttpClient
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
    this.userService.getContactInfo().subscribe({
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
          // this.cartService.cart.next([]);
          if (response.status !== 'failure') {
            window.open(response.payWithIyzicoPageUrl, '_self', 'noopener,noreferrer');
          } else {
            this.orderStatus = 1;
          }
          // checkoutFormContent: "<script type=\"text/javascript\">if (typeof iyziInit == 'undefined') {var iyziInit = {currency:\"TRY\",token:\"a78bf50b-a98c-4720-9270-a554d97e2af7\",price:330.00,locale:\"tr\",baseUrl:\"https://api.iyzipay.com\", merchantGatewayBaseUrl:\"https://merchant-gateway.iyzipay.com\", registerCardEnabled:false,bkmEnabled:false,bankTransferEnabled:false,bankTransferRedirectUrl:\"http://localhost:4200/iyzipay/callback\",bankTransferCustomUIProps:{},campaignEnabled:false,creditCardEnabled:true,bankTransferAccounts:[],userCards:[],fundEnabled:true,memberCheckoutOtpData:{},force3Ds:true,isSandbox:false,storeNewCardEnabled:true,paymentWithNewCardEnabled:true,enabledApmTypes:[],payWithIyzicoUsed:false,payWithIyzicoEnabled:true,payWithIyzicoCustomUI:{},buyerName:\"Ayşe\",buyerSurname:\"Fatma\",merchantInfo:\"https://taserzuccaciye.com/\",cancelUrl:\"\",buyerProtectionEnabled:false,hide3DS:false,gsmNumber:\"\",email:\"ayse@fatma.com\",checkConsumerDetail:{},subscriptionPaymentEnabled:false,ucsEnabled:false,fingerprintEnabled:false,payWithIyzicoFirstTab:false,metadata : {},createTag:function(){var iyziJSTag = document.createElement('script');iyziJSTag.setAttribute('src','https://static.iyzipay.com/checkoutform/v2/bundle.js?v=1632427382509');document.head.appendChild(iyziJSTag);}};iyziInit.createTag();}</script>"
          // locale: "tr"
          // payWithIyzicoPageUrl: "https://consumer.iyzico.com/checkout?token=a78bf50b-a98c-4720-9270-a554d97e2af7&lang=tr"
          // paymentPageUrl: "https://cpp.iyzipay.com?token=a78bf50b-a98c-4720-9270-a554d97e2af7&lang=tr"
          // status: "success"
          // systemTime: 1632427382510
          // token: "a78bf50b-a98c-4720-9270-a554d97e2af7"
          // tokenExpireTime: 1800
        },
        error: (err) => {
          console.error(err);
          this.orderStatus = 1;
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
