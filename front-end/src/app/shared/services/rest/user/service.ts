import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseRestService } from '../base';
import { RequestMethod, RequestOptions, RequestType } from '../model';
import { ServiceMethod } from './model';
import { User } from 'src/app/shared/models/user';
import { CryptoService } from '../../site/crypto';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseRestService {
  requestType = RequestType.user;

  constructor(private cryptoService: CryptoService, protected injector: Injector) {
    super(injector);
  }

  updateContactInfo(info: any): Observable<any> {
    const options = {
      method: RequestMethod.post,
      body: info,
      serviceMethod: ServiceMethod.updateContact
    } as RequestOptions;
    return this.send<any>(options);
  }

  getUser(): Observable<User> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.empty
    } as RequestOptions;
    return this.send<User>(options).pipe(
      map((user) => {
        user.email = this.cryptoService.basicDecrypt(user.email);
        return user;
      })
    );
  }

  updateGeneralInfo(info: User): Observable<User> {
    const options = {
      method: RequestMethod.post,
      body: info,
      serviceMethod: ServiceMethod.updateGeneral
    } as RequestOptions;
    return this.send<User>(options);
  }

  updatePassword(info: any): Observable<any> {
    const options = {
      method: RequestMethod.post,
      body: info,
      serviceMethod: ServiceMethod.updatePassword
    } as RequestOptions;
    return this.send<any>(options);
  }

  getContactInfo(): Observable<any> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.contactInfo
    } as RequestOptions;
    return this.send<any>(options).pipe(
      map((info) => {
        info.city = this.cryptoService.basicDecrypt(info.city);
        info.district = this.cryptoService.basicDecrypt(info.district);
        info.address = this.cryptoService.basicDecrypt(info.address);
        info.phone = this.cryptoService.basicDecrypt(info.phone);
        return info;
      })
    );
  }
}
