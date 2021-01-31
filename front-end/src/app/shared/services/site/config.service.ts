import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { SiteConfig } from '../../models/site-config';
import { CartService } from '../rest/cart.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config: SiteConfig;
  configInited = false;
  constructor(private httpClient: HttpClient) {}

  initSiteConfig(): Observable<void> {
    return new Observable((observer) => {
      this.httpClient.get<SiteConfig>('assets/config/site.json').subscribe((siteConfig) => {
        this.config = siteConfig;
        observer.next();
      });
    });
  }
}
