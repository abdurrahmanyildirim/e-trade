import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../../models/contact';
import { ConfigService } from '../site/config.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  contactRequest(contact: Contact): Observable<any> {
    return this.http.post<any>(
      this.configService.config.domain + 'contact/contact-request',
      contact
    );
  }

  getMesssages(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.configService.config.domain + 'contact/messages');
  }

  toggleRead(id: string): Observable<Contact> {
    return this.http.get<Contact>(
      this.configService.config.domain + 'contact/toggle-read?id=' + id
    );
  }

  removeMessage(id: string): Observable<any> {
    return this.http.get<any>(this.configService.config.domain + 'contact/remove?id=' + id);
  }
}
