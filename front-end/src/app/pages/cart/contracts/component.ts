import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { isPresent } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { StateService } from '../service';
import { Contact } from './model';

@Component({
  selector: 'app-contracts',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractsComponent implements OnInit, OnDestroy {
  subs = new Subscription();
  orderStatus: number = -1;
  contractsChecked: boolean = false;

  constructor(
    private stateService: StateService,
    private cartService: CartService,
    private snackbar: SnackbarService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cd.detectChanges();
  }

  purchaseOrder(): void {
    if (this.stateService.contactInfoForm.valid && this.contractsChecked) {
      this.orderStatus = 0;
      this.stateService.contactInfoForm.patchValue({
        phone: this.stateService.contactInfoForm.value.phone.split(' ').join('')
      });
      const contactInfo = Object.assign({}, this.stateService.contactInfoForm.value) as Contact;
      contactInfo.contractsChecked = this.contractsChecked;
      const subs1 = timer(3000).subscribe({
        next: () => {
          const subs2 = this.cartService.purchaseOrder(contactInfo).subscribe({
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
              this.cd.detectChanges();
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
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
