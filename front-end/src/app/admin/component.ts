import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { isPresent } from '../shared/util/common';
import { RouteCategory } from './model';
import { AdminService } from './service';

@Component({
  selector: 'app-admin',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [AdminService]
})
export class AdminComponent implements OnInit, OnDestroy {
  categories: RouteCategory[];
  routes: any;
  subs = new Subscription();

  constructor(
    private adminService: AdminService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routes = this.getRoutes();
    const subs = this.adminService.routeInfo.subscribe({
      next: (categories) => {
        this.categories = categories;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.subs.add(subs);
  }

  changeRouteKey(key: string): void {
    document.querySelectorAll('.category').forEach((category) => {
      if (category.id !== key.toString()) {
        category.classList.remove('active-category');
      } else {
        category.classList.add('active-category');
      }
    });
    const base = this.router.url.split('?')[0];
    const newRoute = base + '?key=' + key;
    this.router.navigateByUrl(newRoute);
  }

  getRoutes(): any {
    return [
      {
        name: 'Siparişler',
        route: 'orders'
      },
      {
        name: 'Ürünler',
        route: 'products'
      },
      {
        name: 'Ürün Ekle',
        route: 'new-product'
      },
      {
        name: 'Mesaj Kutusu',
        route: 'message-box'
      },
      {
        name: 'Kategoriler',
        route: 'category'
      },
      {
        name: 'Diğer',
        route: 'other'
      }
    ];
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
