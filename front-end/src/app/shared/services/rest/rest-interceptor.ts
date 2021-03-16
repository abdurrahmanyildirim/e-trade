import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { StorageKey } from '../../models/storage';
import { CryptoService } from '../site/crypto';

@Injectable()
export class RestInterceptor implements HttpInterceptor {
  crucialKeys = new Map([
    ['password', 'password'],
    ['email', 'email'],
    ['address', 'address'],
    ['phone', 'phone']
  ]);

  constructor(private authService: AuthService, private cryptoService: CryptoService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = this.cryptBody(req);
    if (this.authService.loggedIn()) {
      const authRequest = req.clone({
        headers: this.headers()
      });
      return next.handle(authRequest);
    }
    return next.handle(req);
  }

  private headers(): HttpHeaders {
    const headers = new HttpHeaders().set(
      'Authorization',
      'jwt ' + window.localStorage.getItem(StorageKey.Token)
    );
    return headers;
  }

  private cryptBody(req: HttpRequest<any>): HttpRequest<any> {
    const body = req.body;
    for (const key in body) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        if (this.crucialKeys.has(key)) {
          const resolvedData = this.cryptoService.basicEncrypt(body[key]);
          req.body[key] = resolvedData;
        }
      }
    }
    return req;
  }
}
