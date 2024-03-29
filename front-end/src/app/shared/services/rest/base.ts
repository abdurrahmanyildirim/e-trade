import { HttpClient, HttpParams } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { isPresent } from '../../util/common';
import { ConfigService } from '../site/config';
import { RequestRoute, RequestOptions } from './model';

export abstract class BaseRestService {
  protected configService: ConfigService;
  protected http: HttpClient;

  protected route: RequestRoute;

  constructor(protected injector: Injector) {
    this.configService = this.injector.get(ConfigService);
    this.http = this.injector.get(HttpClient);
  }

  protected send<T>(requestOptions: RequestOptions): Observable<T> {
    const address = this.prepareAddress(requestOptions);
    switch (requestOptions.method) {
      case 'get':
        return this.http.get<T>(address);
      case 'post':
        return this.http.post<T>(address, requestOptions.body);
      case 'delete':
        return this.http.delete<T>(address);
      default:
        return this.http.get<T>(address);
    }
  }

  private prepareAddress(requestOptions: RequestOptions): string {
    let address = this.configService.config.baseUrl + 'api/' + this.route;
    if (isPresent(requestOptions.serviceMethod)) {
      address += '/' + requestOptions.serviceMethod;
    }
    if (isPresent(requestOptions.params)) {
      address += '?' + this.params(requestOptions.params);
    }
    return address;
  }

  private params(params: any): string {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return httpParams.toString();
  }
}
