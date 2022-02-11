import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRestService } from '../base';
import { RequestMethod, RequestOptions, RequestRoute } from '../model';
import { ServiceMethod } from './model';

@Injectable()
export class LogService extends BaseRestService {
  route = RequestRoute.log;

  constructor(protected injector: Injector) {
    super(injector);
  }

  logs(): Observable<any> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.getLogs
    } as RequestOptions;
    return this.send<any>(options);
  }
}
