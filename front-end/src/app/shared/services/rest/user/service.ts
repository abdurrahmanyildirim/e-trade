import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseRestService } from '../base';
import { RequestMethod, RequestOptions, RequestRoute } from '../model';
import { ServiceMethod } from './model';
import { User } from 'src/app/shared/models/user';
import { CryptoService } from '../../site/crypto';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseRestService {
  route = RequestRoute.user;

  constructor(private cryptoService: CryptoService, protected injector: Injector) {
    super(injector);
  }

  getUser(): Observable<any> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.empty
    } as RequestOptions;
    return this.send<any>(options).pipe(
      map((user) => {
        user.email = this.cryptoService.basicDecrypt(user.email);
        user.city = this.cryptoService.basicDecrypt(user.city);
        user.district = this.cryptoService.basicDecrypt(user.district);
        user.address = this.cryptoService.basicDecrypt(user.address);
        user.phone = this.cryptoService.basicDecrypt(user.phone);
        return user;
      })
    );
  }

  update(info: User): Observable<User> {
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
}
