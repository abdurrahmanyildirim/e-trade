import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { Category, Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/rest/product.service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder.service';
import { isPresent, nullValidator } from 'src/app/shared/util/common';
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
  categories: Category[];
  currentCategory: Category;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: SnackbarService,
    private screenHolder: ScreenHolderService
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
      description: new FormControl(null, [Validators.required, nullValidator()]),
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
    this.initCategories();
  }

  onFilesChange(files: File[]) {
    this.photos = files;
    this.photosForm.patchValue({
      photos: this.photos
    });
  }

  initCategories(): void {
    const sub = this.productService.categories().subscribe({
      next: (categories) => {
        this.currentCategory = categories[0];
        this.categories = categories.slice();
        this.infoForm.patchValue({
          category: categories[0].name
        });
      },
      error: (err) => console.log(err)
    });
    this.subs.add(sub);
  }

  onCategoryChange(): void {
    this.infoForm.patchValue({
      category: this.currentCategory.name
    });
  }

  insertProduct(): void {
    if (this.infoForm.invalid || this.photosForm.invalid) {
      return;
    }
    this.screenHolder.show();
    const sub = this.productService.uploadPhotos(this.photos.reverse()).subscribe({
      next: (photos) => {
        const product = Object.assign({}, this.infoForm.value) as Product;
        product.discountRate = product.discountRate / 100;
        product.photos = photos;
        product.comments = [];
        product.rate = 0;
        const sub1 = this.productService.addNewProduct(product).subscribe({
          next: () => {
            this.screenHolder.hide();
            this.reset();
            this.snackBar.showSuccess('Ürün Eklendi.');
          },
          error: (err) => {
            this.screenHolder.hide();
            this.stepper.previous();
            this.stepper.previous();
            this.snackBar.showError('Ürün ekleme sırasında hata oldu.');
            console.log(err);
          }
        });
        this.subs.add(sub1);
      },
      error: (err) => {
        this.screenHolder.hide();
        this.snackBar.showError('Fotoğraflar yüklenemedi.');
        console.log(err);
      }
    });
    this.subs.add(sub);
  }

  reset(): void {
    this.infoForm.reset();
    this.photosForm.reset();
    this.photos = [];
    this.photoUploadComponent.reset();
    this.stepper.reset();
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
