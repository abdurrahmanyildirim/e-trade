import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  Form,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/shared/components/dialog/service';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/rest/product.service';
import { isPresent } from 'src/app/shared/util/common';

@Component({
  selector: 'app-mn-product-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class MnProductDetailComponent implements OnInit, OnDestroy {
  productId: string;
  product: Product;
  form: FormGroup;
  subs = new Subscription();

  constructor(
    private router: Router,
    public productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const key = 'id';
      this.productId = params[key];
      this.initProduct();
    });
  }

  initProduct(): void {
    this.productService.productById(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.initProductForm();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  initProductForm(): void {
    this.form = this.fb.group({
      _id: this.product._id,
      name: new FormControl(this.product.name, [Validators.required, this.nullValidator()]),
      category: new FormControl(this.product.category, [Validators.required, this.nullValidator()]),
      description: new FormControl(this.product.description, [
        Validators.required,
        this.nullValidator()
      ]),
      discountRate: new FormControl(this.product.discountRate * 100, [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
        Validators.pattern(/^[0-9]*$/),
        this.nullValidator()
      ]),
      price: new FormControl(this.product.price, [
        Validators.required,
        Validators.pattern(/^[0-9]*.?[0-9]{1,2}$/),
        this.nullValidator()
      ]),
      stockQuantity: new FormControl(this.product.stockQuantity, [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
        this.nullValidator()
      ]),
      isActive: new FormControl(this.product.isActive + '', [
        Validators.required,
        this.nullValidator()
      ]),
      photos: new FormControl(this.product.photos, [Validators.required, this.nullValidator()]),
      addedDate: new FormControl(this.product.addedDate, [
        Validators.required,
        this.nullValidator()
      ]),
      rate: new FormControl(this.product.rate, [Validators.required, this.nullValidator()]),
      comments: new FormControl(this.product.comments),
      brand: new FormControl(this.product.brand, [Validators.required, this.nullValidator()])
    });
  }

  nullValidator(): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value ? control.value : '';
      return !!control.parent && !!control.parent.value && (value + '').trim().length >= 0
        ? null
        : { isNull: { value: false } };
    };
  }

  remove(): void {
    this.dialogService.openDialog({
      acceptButton: 'Onayla',
      refuseButton: 'Vazgeç',
      desc: 'Bu ürünü kaldırmak istediğinize emin misiniz?',
      onClose: (result) => {
        if (result) {
          this.productService.remove(this.productId).subscribe({
            next: (res) => {
              this.snackBarService.showSuccess('Ürün Silindi.');
              // TODO : Fotoğrafların da silinmesi sağlanacak
              this.location.back();
            },
            error: (error) => {
              this.snackBarService.showError('Silerken bir hata meydana geldi');
              console.log(error);
            }
          });
        }
      }
    });
  }

  saveChanges(): void {
    if (this.form.invalid) {
      console.log(this.form.value);
      this.snackBarService.showError('Kaydetmeden önce bütün bilgileri girdiğinizden emin olunuz!');
      return;
    }
    const product = Object.assign({}, this.form.value);
    product.isActive = product.isActive === 'true';
    product.discountRate = product.discountRate / 100;
    this.dialogService.openDialog({
      acceptButton: 'Onayla',
      refuseButton: 'Vazgeç',
      desc: 'Yaptığınız değişiklikleri kaydetmek istediğinize emin misiniz?',
      onClose: (result) => {
        if (result) {
          this.productService.update(product).subscribe({
            next: (res) => {
              this.snackBarService.showSuccess('Değişiklikler Kaydedildi.');
            },
            error: (error) => {
              this.snackBarService.showError('Bir hata meydana geldi.');
              console.log(error);
            }
          });
        }
      },
      onError: (error) => {
        console.log(error);
      }
    });
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
