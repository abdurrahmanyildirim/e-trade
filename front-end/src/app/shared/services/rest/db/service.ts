import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRestService } from '../base';
import { RequestMethod, RequestOptions, RequestType } from '../model';
import { ServiceMethod } from './model';

@Injectable({
  providedIn: 'root'
})
export class DbService extends BaseRestService {
  requestType = RequestType.db;

  constructor(protected injector: Injector) {
    super(injector);
  }

  createBackUp(): Observable<any> {
    const address =
      this.configService.config.baseUrl + this.requestType + '/' + ServiceMethod.createBackup;
    return this.http.get(address, { responseType: 'blob' });
  }
}
