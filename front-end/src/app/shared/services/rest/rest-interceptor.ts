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

/** Pass untouched request through to the next request handler. */
@Injectable()
export class RestInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
    // headers = headers.append('Content-Type', 'application/json');
    return headers;
  }
}
