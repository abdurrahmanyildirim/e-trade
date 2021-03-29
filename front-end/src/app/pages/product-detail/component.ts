import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
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
  styleUrls: ['./component.css']
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
    private snackbar: SnackbarService
  ) {
    const subs = this.activatedRouter.params.subscribe((params) => {
      this.productId = params.id;
    });
    this.subs.add(subs);
  }
  ngAfterViewInit(): void {
    this.listenResize();
    document.body.scrollTop = 0;
  }

  ngOnInit(): void {
    this.getProductById();
    this.orders = this.cartService.cart.value;
    this.initAddToCartStream();
  }

  listenResize() {
    if (document.body.clientWidth <= 650) {
      setTimeout(() => {
        this.photos.width = this.photos.height = document.body.clientWidth - 12;
      }, 200);
    }
    const sub = fromEvent(window, 'resize').subscribe((event: any) => {
      if (document.body.clientWidth <= 650) {
        this.photos.width = this.photos.height = document.body.clientWidth - 12;
      } else {
        this.photos.width = this.photos.height = 448;
      }
    });
    this.subs.add(sub);
  }

  getProductById(): void {
    const subs = this.productService.productById(this.productId).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: (error) => console.log(error)
    });
    this.subs.add(subs);
  }

  initAddToCartStream(): void {
    const sub = this.addTocartClick.pipe(throttleTime(200)).subscribe({
      next: (product: Product) => {
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
        this.cartService.updateCart(this.orders);
        this.snackbar.showInfo('Sepete Eklendi.');
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
