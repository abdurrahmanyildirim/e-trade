import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/rest/product/service';
import { ObjectHelper } from 'src/app/shared/util/helper/object';

@Component({
  selector: 'app-main',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, OnDestroy {
  sub: Subscription;
  products: Product[];
  discounted: Product[];
  @ViewChild('photo') photo: HTMLElement;
  mostLiked: Product[];
  newProducts: Product[];
  owlOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    navText: ['<', '>'],
    lazyLoad: true,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      320: {
        items: 2
      },
      470: {
        items: 3
      },
      690: {
        items: 3
      },
      920: {
        items: 4
      },
      1100: {
        items: 5
      }
    },
    nav: true
  };

  constructor(private productService: ProductService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initProducts();
  }

  initProducts(): void {
    this.products = this.productService.products.value.slice();
    this.initDiscountedProducts();
    this.initMostLiked();
    this.initNewProducts();
    this.cd.detectChanges();
  }

  initDiscountedProducts(): void {
    this.discounted = this.products
      .filter((product) => product.discountRate > 0)
      .sort((a: Product, b: Product) => b.discountRate - a.discountRate)
      .slice();
  }

  initMostLiked(): void {
    this.mostLiked = this.products.sort((a: Product, b: Product) => b.rate - a.rate).slice(0, 15);
  }

  initNewProducts(): void {
    this.newProducts = this.products
      .sort(
        (a: Product, b: Product) =>
          new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
      )
      .slice(0, 15);
  }

  ngOnDestroy(): void {
    ObjectHelper.removeReferances(this);
  }
}
