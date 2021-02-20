import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
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
  @ViewChild('stepper') stepper: any;
  counter = 11;
  uploadedPhotos: CloudinaryPhoto[] = [];
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
      name: new FormControl(null, [Validators.required, this.nullValidator()]),
      category: new FormControl(null, [Validators.required, this.nullValidator()]),
      price: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9.]*$/),
        this.nullValidator()
      ]),
      description: new FormControl(null, [Validators.required, this.nullValidator()]),
      discountRate: new FormControl(null, [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
        Validators.pattern(/^[0-9]*$/),
        this.nullValidator()
      ]),
      stockQuantity: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
        this.nullValidator()
      ]),
      brand: new FormControl(null, [Validators.required, this.nullValidator()])
    });
    this.photosForm = this.fb.group({
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
    if (this.photos.length >= 4 || files.length > 4) {
      this.snackBar.showError('En fazla 4 fotoğraf yüklenebilir');
      return;
    }
    for (const file of files) {
      if (this.isSupportedFile(file)) {
        this.readFile(file).subscribe({
          next: (fileString) => {
            this.counter++;
            this.photos.push(file);
            const photo = {
              path: fileString as string,
              publicId: 'photo' + this.counter,
              _id: 'photoId' + this.counter
            };
            this.uploadedPhotos.push(photo);
            this.photosForm.patchValue({
              photos: this.uploadedPhotos
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

  resetAllData(): void {
    this.infoForm.reset();
    this.photosForm.reset();
    this.photos = [];
    this.uploadedPhotos = [];
    this.stepper.reset();
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
