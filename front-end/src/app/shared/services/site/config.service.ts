import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { SiteConfig } from '../../models/site-config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config: SiteConfig;
  configInited = false;
  constructor(private httpClient: HttpClient) {}

  initSiteConfig(): Observable<void> {
    const dir = isDevMode() ? 'dev' : 'prod';
    return new Observable((observer) => {
      this.httpClient.get<SiteConfig>(`assets/config/${dir}/site.json`).subscribe((siteConfig) => {
        this.config = siteConfig;
        observer.next();
      });
    });
  }
}
