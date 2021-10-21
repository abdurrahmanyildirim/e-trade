import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRestService } from '../base';
import { RequestMethod, RequestOptions, RequestRoute } from '../model';
import { ServiceMethod } from './model';

@Injectable({
  providedIn: 'root'
})
export class DbService extends BaseRestService {
  route = RequestRoute.db;

  constructor(protected injector: Injector) {
    super(injector);
  }

  createBackUp(): Observable<any> {
    const address =
      this.configService.config.baseUrl + this.route + '/' + ServiceMethod.createBackup;
    return this.http.get(address, { responseType: 'blob' });
  }
}
