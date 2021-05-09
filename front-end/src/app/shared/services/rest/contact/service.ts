import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contact } from 'src/app/shared/models/contact';
import { CryptoService } from '../../site/crypto';
import { BaseRestService } from '../base';
import { RequestMethod, RequestOptions, RequestType } from '../model';
import { ServiceMethod } from './model';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends BaseRestService {
  requestType = RequestType.contact;

  constructor(private cryptoService: CryptoService, protected injector: Injector) {
    super(injector);
  }

  contactRequest(contact: Contact): Observable<any> {
    const options = {
      method: RequestMethod.post,
      serviceMethod: ServiceMethod.request,
      body: contact
    } as RequestOptions;
    return this.send<any>(options);
  }

  getMesssages(): Observable<Contact[]> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.messages
    } as RequestOptions;
    return this.send<Contact[]>(options).pipe(
      map((messages) => {
        return messages.map((message) => {
          message.email = this.cryptoService.basicDecrypt(message.email);
          message.phone = this.cryptoService.basicDecrypt(message.phone);
          return message;
        });
      })
    );
  }

  toggleRead(id: string): Observable<Contact> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.toggleRead,
      params: { id }
    } as RequestOptions;
    return this.send<Contact>(options);
  }

  removeMessage(id: string): Observable<any> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.remove,
      params: { id }
    } as RequestOptions;
    return this.send<any>(options);
  }
}
