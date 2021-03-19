import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contact } from '../../models/contact';
import { ConfigService } from '../site/config.service';
import { CryptoService } from '../site/crypto';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private cryptoService: CryptoService
  ) {}

  contactRequest(contact: Contact): Observable<any> {
    return this.http.post<any>(
      this.configService.config.baseUrl + 'contact/contact-request',
      contact
    );
  }

  getMesssages(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.configService.config.baseUrl + 'contact/messages').pipe(
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
    return this.http.get<Contact>(
      this.configService.config.baseUrl + 'contact/toggle-read?id=' + id
    );
  }

  removeMessage(id: string): Observable<any> {
    return this.http.get<any>(this.configService.config.baseUrl + 'contact/remove?id=' + id);
  }
}
