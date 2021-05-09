import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/shared/components/dialog/service';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/rest/product/service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder.service';
import { isPresent, nullValidator } from 'src/app/shared/util/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UtilityService } from 'src/app/shared/services/site/utility.service';
import { DialogType } from 'src/app/shared/components/dialog/component';

@Component({
  selector: 'app-mn-product-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MnProductDetailComponent implements OnInit, OnDestroy {
  productId: string;
  product: Product;
  form: FormGroup;
  subs = new Subscription();

  constructor(
    public productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    private location: Location,
    private screenHolder: ScreenHolderService,
    private utilityService: UtilityService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const key = 'id';
      this.productId = params[key];
      this.initProduct();
    });
  }

  initProduct(): void {
    this.productService.getById(this.productId).subscribe({
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
      name: new FormControl(this.product.name, [Validators.required, nullValidator()]),
      category: new FormControl(this.product.category, [Validators.required, nullValidator()]),
      description: new FormControl(this.product.description),
      discountRate: new FormControl((this.product.discountRate * 100).toFixed(0), [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
        Validators.pattern(/^[0-9]*$/),
        nullValidator()
      ]),
      price: new FormControl(this.product.price, [
        Validators.required,
        Validators.pattern(/^[0-9]*.?[0-9]{1,2}$/),
        nullValidator()
      ]),
      stockQuantity: new FormControl(this.product.stockQuantity, [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
        nullValidator()
      ]),
      isActive: new FormControl(this.product.isActive + '', [Validators.required, nullValidator()]),
      photos: new FormControl(this.product.photos, [Validators.required, nullValidator()]),
      addedDate: new FormControl(this.product.addedDate, [Validators.required, nullValidator()]),
      rate: new FormControl(this.product.rate, [Validators.required, nullValidator()]),
      comments: new FormControl(this.product.comments),
      brand: new FormControl(this.product.brand, [Validators.required, nullValidator()])
    });
    this.cd.detectChanges();
  }

  remove(): void {
    this.dialogService.confirm({
      acceptButton: 'Onayla',
      refuseButton: 'Vazgeç',
      desc: 'Bu ürünü kaldırmak istediğinize emin misiniz?',
      dialog: DialogType.Confirm,
      onClose: (result) => {
        if (result) {
          this.screenHolder.show();
          const subs = this.productService.remove(this.productId).subscribe({
            next: (res) => {
              this.screenHolder.hide();
              this.snackBarService.showSuccess('Ürün Silindi.');
              this.location.back();
            },
            error: (error) => {
              this.screenHolder.hide();
              this.snackBarService.showError('Silerken bir hata meydana geldi');
              console.log(error);
            }
          });
          this.subs.add(subs);
        }
      },
      onError: (error) => {
        console.log(error);
      }
    });
  }

  saveChanges(): void {
    if (this.form.invalid) {
      this.snackBarService.showError('Kaydetmeden önce bütün bilgileri girdiğinizden emin olunuz!');
      return;
    }
    const product = Object.assign({}, this.form.value);
    product.isActive = product.isActive === 'true';
    product.discountRate = parseFloat((product.discountRate / 100).toFixed(2));
    product.description = this.product.description;
    this.dialogService.confirm({
      acceptButton: 'Onayla',
      refuseButton: 'Vazgeç',
      dialog: DialogType.Confirm,
      desc: 'Yaptığınız değişiklikleri kaydetmek istediğinize emin misiniz?',
      onClose: (result) => {
        if (result) {
          this.screenHolder.show();
          const subs = this.productService.update(product).subscribe({
            next: (res) => {
              this.screenHolder.hide();
              this.snackBarService.showSuccess('Değişiklikler Kaydedildi.');
            },
            error: (error) => {
              this.screenHolder.hide();
              this.snackBarService.showError('Bir hata meydana geldi.');
              console.log(error);
            }
          });
          this.subs.add(subs);
        }
      },
      onError: (error) => {
        console.log(error);
      }
    });
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.product.photos, event.previousIndex, event.currentIndex);
    this.form.patchValue({
      photos: this.product.photos
    });
  }

  showPhoto(path: string): void {
    this.utilityService.photoShower(path);
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
