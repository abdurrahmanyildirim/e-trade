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
import { error } from 'protractor';
import { Observable, Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { Category, CloudinaryPhoto, Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/rest/product.service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder.service';
import { isPresent } from 'src/app/shared/util/common';

@Component({
  selector: 'app-mn-new-product',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class MnNewProductComponent implements OnInit, OnDestroy {
  suppotedPhotos = new Map<string, string>([
    ['jpg', 'jpg'],
    ['jpeg', 'jpeg'],
    ['png', 'png']
  ]);
  photos: File[] = [];
  counter = 11;
  uploadedPhotos: CloudinaryPhoto[] = [];
  subs = new Subscription();
  form: FormGroup;
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
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      name: new FormControl(null, [Validators.required, this.nullValidator()]),
      category: new FormControl(null, [Validators.required, this.nullValidator()]),
      price: new FormControl(0, [
        Validators.required,
        Validators.pattern(/^[0-9.]*$/),
        this.nullValidator()
      ]),
      description: new FormControl(null, [Validators.required, this.nullValidator()]),
      discountRate: new FormControl(0, [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
        Validators.pattern(/^[0-9.]*$/),
        this.nullValidator()
      ]),
      stockQuantity: new FormControl(20, [
        Validators.required,
        Validators.pattern(/^[0-9]*[.]*[0-9]$/),
        this.nullValidator()
      ]),
      brand: new FormControl(null, [Validators.required, this.nullValidator()]),
      photos: new FormControl([], [Validators.required, this.nullValidator()])
    });
    this.initCategories();
  }

  nullValidator(): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value ? control.value : '';
      return !!control.parent && !!control.parent.value && (value + '').trim().length >= 0
        ? null
        : { isNull: { value: false } };
    };
  }

  onPhotoUpload(event: any): void {
    const files = event.target.files;
    for (const file of files) {
      if (this.isSupportedFile(file)) {
        this.readFile(file).subscribe({
          next: (fileString) => {
            this.counter++;
            this.photos.push(file);
            this.uploadedPhotos.push({
              path: fileString as string,
              publicId: 'photo' + this.counter,
              _id: 'photoId' + this.counter
            });
            const photos = this.form.value.photos;
            photos.push({
              path: fileString as string,
              publicId: 'photo' + this.counter,
              _id: 'photoId' + this.counter
            });
            this.form.patchValue({
              photos
            });
          },
          error: (err) => console.log(err)
        });
      }
    }
    event.target.files = null;
  }

  isSupportedFile(file: File): boolean {
    const ext = file.name.split('.')[file.name.split('.').length - 1];
    if (!this.suppotedPhotos.has(ext)) {
      return false;
    }
    return true;
  }

  readFile(file: File): Observable<string> {
    return new Observable<string>((observer) => {
      try {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          observer.next(reader.result as string);
          reader = null;
          observer.complete();
        };
      } catch (error) {
        observer.error(error);
      }
    });
  }

  initCategories(): void {
    const sub = this.productService.categories().subscribe({
      next: (categories) => {
        this.currentCategory = categories[0];
        this.categories = categories.slice();
        this.form.patchValue({
          category: categories[0].name
        });
      },
      error: (err) => console.log(err)
    });
    this.subs.add(sub);
  }

  onCategoryChange(): void {
    this.form.patchValue({
      category: this.currentCategory.name
    });
  }

  uploadPhotos(): Observable<CloudinaryPhoto[]> {
    return new Observable<CloudinaryPhoto[]>((observer) => {
      const fd = new FormData();
      this.photos.forEach((photo) => {
        fd.append('photos', photo, photo.name);
      });
      const sub = this.productService.uploadPhoto(fd).subscribe({
        next: (photos: CloudinaryPhoto[]) => {
          observer.next(photos);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
      this.subs.add(sub);
    });
  }

  insertProduct(): void {
    if (this.form.invalid) {
      return;
    }
    this.screenHolder.show();
    this.uploadPhotos().subscribe({
      next: (photos) => {
        this.form.patchValue({
          photos,
          discountRate: this.form.value.discountRate / 100
        });
        const product = Object.assign({}, this.form.value) as Product;
        product.comments = [];
        product.rate = 0;
        const sub = this.productService.addNewProduct(product).subscribe({
          next: () => {
            console.log('Ürün EKlendi.');
            this.screenHolder.hide();
            this.resetAllData();
            this.snackBar.showSuccess('Ürün Eklendi.');
          },
          error: (err) => {
            this.screenHolder.hide();
            this.resetAllData();
            this.snackBar.showError('Ürün ekleme sırasında hata oldu.');
            console.log(err);
          }
        });
        this.subs.add(sub);
      },
      error: (err) => {
        this.screenHolder.hide();
        this.snackBar.showError('Fotoğraflar yüklenemedi.');
        console.log(err);
      }
    });
  }

  resetAllData(): void {
    this.form.reset();
    this.photos = [];
    this.uploadedPhotos = [];
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
