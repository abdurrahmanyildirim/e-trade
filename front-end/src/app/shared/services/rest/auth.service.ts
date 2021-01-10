import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LoginUser } from 'src/app/pages/auth/login/model';
import { RegisterUser } from 'src/app/pages/auth/register/model';
import { StorageKey } from '../../models/storage';
import { LoginResponse, User } from '../../models/user';
import { ConfigService } from '../site/config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  headers = new HttpHeaders().append('Content-Type', 'application/json');
  currentUser = new BehaviorSubject<User>(JSON.parse(window.localStorage.getItem(StorageKey.User)));
  isAuth = new BehaviorSubject<boolean>(this.loggedIn());

  constructor(private configService: ConfigService, private http: HttpClient) {}

  login(user: LoginUser): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.configService.config.domain + 'auth/login', user, {
      headers: this.headers
    });
  }

  register(user: RegisterUser): Observable<RegisterUser> {
    return this.http.post<RegisterUser>(this.configService.config.domain + 'auth/register', user, {
      headers: this.headers
    });
  }

  loggedIn(): boolean {
    return !!window.localStorage.getItem(StorageKey.Token);
  }

  saveToken(token: string): void {
    window.localStorage.setItem(StorageKey.Token, token);
  }
}
