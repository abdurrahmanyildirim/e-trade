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
    private fb: FormBuilder
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
        Validators.pattern(/^[0-9]*$/),
        this.nullValidator()
      ]),
      stockQuantity: new FormControl(this.product.stockQuantity, [
        Validators.required,
        Validators.pattern(/^[0-9.]*$/),
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
      comments: new FormControl(this.product.comments, [Validators.required, this.nullValidator()]),
      brand: new FormControl(this.product.brand, [Validators.required, this.nullValidator()])
    });

    // name: string;
    // category: string;
    // price: number;
    // description: string;
    // discountRate: number;
    // stockQuantity: number;
    // isActive?: boolean;
    // rate: number;
    // brand: string;
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
    this.dialogService
      .openDialog({
        acceptButton: 'Onayla',
        refuseButton: 'Vazgeç',
        desc: 'Bu ürünü kaldırmak istediğinize emin misiniz?'
      })
      .subscribe({
        next: (result) => {
          console.log(result);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  changeSituation(): void {
    let desc = '';
    if (this.product.isActive) {
      desc =
        'Ürünü gizlediğinizde kullanılıcılar bu ürünü göremeyecektir.\n Gizlemek istediğinize emin misiniz?';
    } else {
      desc = 'Ürünü gizliliği kaldırılacak. Kaldırmak istediğinize emin misiniz?';
    }
    this.dialogService
      .openDialog({
        acceptButton: 'Onayla',
        refuseButton: 'Vazgeç',
        desc
      })
      .subscribe({
        next: (result) => {
          console.log(result);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
