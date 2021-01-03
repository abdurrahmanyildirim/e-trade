import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Order } from 'src/app/shared/models/order';
import { Product } from 'src/app/shared/models/product';
import { CartService } from 'src/app/shared/services/rest/cart.service';
import { ProductService } from 'src/app/shared/services/rest/product.service';
import { isPresent } from 'src/app/shared/util/common';

@Component({
  selector: 'app-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  quantity = 1;
  productId: string;
  orders: Order[];
  subscription = new Subscription();
  addTocartClick = new Subject<Product>();
  product: Product;

  constructor(
    private cartService: CartService,
    private activatedRouter: ActivatedRoute,
    private productService: ProductService
  ) {
    const subs = this.activatedRouter.params.subscribe((params) => {
      this.productId = params.id;
    });
    this.subscription.add(subs);
  }

  ngOnInit(): void {
    this.getProductById();
    this.orders = this.cartService.cart.value;
    this.initAddToCartStream();
  }

  getProductById(): void {
    const subs = this.productService.allProducts().subscribe({
      next: (products) => {
        this.product = products.find((product) => product._id === this.productId);
      }
    });
    this.subscription.add(subs);
  }

  initAddToCartStream(): void {
    const subs = this.addTocartClick.pipe(debounceTime(200)).subscribe({
      next: (product: Product) => {
        let newOrder = this.orders.find((order) => order.productId === product._id);
        if (isPresent(newOrder)) {
          this.orders.find((order) => order.productId === product._id).quantity += this.quantity;
        } else {
          newOrder = {
            productId: product._id,
            discountRate: product.discountRate,
            mainPhoto: product.photos[0],
            name: product.name,
            price: product.price,
            quantity: this.quantity,
            category: product.category,
            brand: product.brand
          } as Order;
          this.orders.push(newOrder);
        }
        this.cartService.cart.next(this.orders);
      }
    });
    this.subscription.add(subs);
  }

  ngOnDestroy(): void {
    if (isPresent(this.subscription)) {
      this.subscription.unsubscribe();
    }
  }
}
