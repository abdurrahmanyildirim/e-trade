import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SiteConfig } from '../../models/site-config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config: SiteConfig;
  configInited = false;
  constructor(private httpClient: HttpClient) {}

  initSiteConfig(): void {
    this.httpClient.get<SiteConfig>('assets/config/site.json').subscribe((siteConfig) => {
      this.config = siteConfig;
      this.configInited = true;
    });
  }
}
