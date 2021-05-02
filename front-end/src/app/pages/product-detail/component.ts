import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { switchMap, throttleTime } from 'rxjs/operators';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { Order } from 'src/app/shared/models/order';
import { Product } from 'src/app/shared/models/product';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { ProductService } from 'src/app/shared/services/rest/product.service';
import { isPresent } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';

@Component({
  selector: 'app-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  quantity = 1;
  productId: string;
  orders: Order[];
  subs = new Subscription();
  addTocartClick = new Subject<Product>();
  product: Product;
  photos = {
    width: 450,
    height: 450
  };

  constructor(
    private cartService: CartService,
    private activatedRouter: ActivatedRoute,
    private productService: ProductService,
    private snackbar: SnackbarService,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const subs = this.activatedRouter.params.subscribe((params) => {
      this.productId = params.id;
      this.getProductById();
    });
    this.subs.add(subs);
    this.orders = this.cartService.cart.value;
    this.initAddToCartStream();
  }

  ngAfterViewInit(): void {
    this.listenResize();
    document.body.scrollTop = 0;
  }

  listenResize(): void {
    const sub = fromEvent(window, 'resize').subscribe((event: any) => {
      if (document.body.clientWidth <= 650) {
        this.photos.width = this.photos.height = document.body.clientWidth - 12;
      } else {
        this.photos.width = this.photos.height = 450;
      }
      this.cd.detectChanges();
    });
    this.subs.add(sub);
  }

  getProductById(): void {
    const subs = this.productService.productById(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.product.description = this.sanitizer.bypassSecurityTrustHtml(this.product.description);
        this.cd.detectChanges();
      },
      error: (error) => console.log(error)
    });
    this.subs.add(subs);
  }

  initAddToCartStream(): void {
    const sub = this.addTocartClick
      .pipe(
        throttleTime(200),
        switchMap((product: Product) => {
          let newOrder = this.orders.find((order) => order.productId === product._id);
          if (isPresent(newOrder)) {
            this.orders.find((order) => order.productId === product._id).quantity += this.quantity;
          } else {
            newOrder = {
              productId: product._id,
              discountRate: product.discountRate,
              photo: product.photos[0].path,
              name: product.name,
              price: product.price,
              quantity: this.quantity,
              category: product.category,
              brand: product.brand
            } as Order;
            this.orders.push(newOrder);
          }
          return this.cartService.updateCart(this.orders);
        })
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.snackbar.showSuccess('Sepete Eklendi.');
          }
        },
        error: (err) => {
          console.error(err);
          this.snackbar.showError('sepete ekleme sırasında hata meydana geldi');
        }
      });
    this.subs.add(sub);
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
