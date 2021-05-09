import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { Product } from 'src/app/shared/models/product';
import { CategoryService } from 'src/app/shared/services/rest/category/service';
import { PhotoService } from 'src/app/shared/services/rest/photo/service';
import { ProductService } from 'src/app/shared/services/rest/product/service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder.service';
import { isPresent, nullValidator } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { PhotoUploadComponent } from './photo-upload/component';

@Component({
  selector: 'app-mn-new-product',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class MnNewProductComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper: MatHorizontalStepper;
  @ViewChild('photoUpload') photoUploadComponent: PhotoUploadComponent;
  photos: File[] = [];
  subs = new Subscription();
  infoForm: FormGroup;
  photosForm: FormGroup;
  description = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: SnackbarService,
    private screenHolder: ScreenHolderService,
    public categoryService: CategoryService,
    private photoService: PhotoService
  ) {}

  ngOnInit(): void {
    this.createForms();
  }

  createForms(): void {
    this.infoForm = this.fb.group({
      name: new FormControl(null, [Validators.required, nullValidator()]),
      category: new FormControl(null, [Validators.required, nullValidator()]),
      price: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9.]*$/),
        nullValidator()
      ]),
      discountRate: new FormControl(null, [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
        Validators.pattern(/^[0-9]*$/),
        nullValidator()
      ]),
      stockQuantity: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
        nullValidator()
      ]),
      brand: new FormControl(null, [Validators.required, nullValidator()])
    });
    this.photosForm = this.fb.group({
      photos: new FormControl([], [Validators.required, nullValidator()])
    });
  }

  onFilesChange(files: File[]): void {
    this.photosForm.patchValue({
      photos: files
    });
  }

  insertProduct(): void {
    if (this.infoForm.invalid || this.photosForm.invalid) {
      return;
    }
    this.screenHolder.show();
    const uploadedPhotos = Object.assign({}, this.photosForm.value).photos;
    const sub = this.photoService
      .uploadPhotos(uploadedPhotos)
      .pipe(
        switchMap((photos) => {
          const product = Object.assign({}, this.infoForm.value) as Product;
          product.photos = photos;
          product.description = this.description;
          return this.productService.insert(product);
        })
      )
      .subscribe({
        next: (product) => {
          this.screenHolder.hide();
          this.reset();
          this.description = '';
          this.snackBar.showSuccess('Ürün Eklendi.');
          const products = [...this.productService.products.value, product] as Product[];
          this.productService.products.next(products);
        },
        error: (err) => {
          this.screenHolder.hide();
          this.stepper.previous();
          this.stepper.previous();
          this.snackBar.showError('Ürün ekleme sırasında hata oldu.');
          console.log(err);
        }
      });
    this.subs.add(sub);
  }

  reset(): void {
    this.photos = [];
    this.photoUploadComponent.reset();
    this.stepper.reset();
    Object.keys(this.infoForm.controls).forEach((key) => {
      this.infoForm.controls[key].setErrors(null);
    });
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
