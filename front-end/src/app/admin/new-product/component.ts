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
import { Subscription } from 'rxjs';
import { Category, CloudinaryPhoto } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/rest/product.service';
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
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.initCategories();
  }

  createForm(): void {
    this.form = this.fb.group({
      name: new FormControl(null, [Validators.required, this.nullValidator()]),
      category: new FormControl(null, [Validators.required, this.nullValidator()]),
      price: new FormControl(0, [Validators.required, this.nullValidator()]),
      description: new FormControl(null, [Validators.required, this.nullValidator()]),
      discountRate: new FormControl(0, [Validators.required, this.nullValidator()]),
      stockQuantity: new FormControl(20, [Validators.required, this.nullValidator()]),
      brand: new FormControl(null, [Validators.required, this.nullValidator()]),
      photos: new FormControl(null, [Validators.required, this.nullValidator()])
    });
  }

  nullValidator(): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value ? control.value + '' : '';
      return value.trim().length >= 0 ? null : { isNull: { value: false } };
    };
  }

  onPhotoUpload(event: any): void {
    const files = event.target.files;
    for (const file of files) {
      if (this.isSupportedFile(file)) {
        this.photos.push(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          this.counter++;
          this.uploadedPhotos.push({
            path: reader.result as string,
            publicId: 'photo' + this.counter,
            _id: 'photoId' + this.counter
          });
          // this.uploadedPhotos.push(reader.result);
        };
      }
    }
  }

  isSupportedFile(file: File): boolean {
    const ext = file.name.split('.')[file.name.split('.').length - 1];
    if (!this.suppotedPhotos.has(ext)) {
      return false;
    }
    return true;
  }

  initCategories(): void {
    const sub = this.productService.categories().subscribe({
      next: (categories) => {
        this.currentCategory = categories[0];
        this.categories = categories;
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

  insertProduct(): void {}

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
