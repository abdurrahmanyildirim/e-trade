import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/shared/services/rest/product.service';
import { isPresent } from 'src/app/shared/util/common';

@Component({
  selector: 'app-mn-product-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class MnProductDetailComponent implements OnInit, OnDestroy {
  subs = new Subscription();

  constructor(private router: Router, public productService: ProductService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
