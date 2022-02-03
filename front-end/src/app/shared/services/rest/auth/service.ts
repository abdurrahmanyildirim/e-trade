import { HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginUser } from 'src/app/pages/auth/login/model';
import { RegisterUser } from 'src/app/pages/auth/register/model';
import { BaseRestService } from '../base';
import { RequestMethod, RequestOptions, RequestRoute } from '../model';
import { ServiceMethod } from './model';
import { LoginResponse, Roles } from 'src/app/shared/models/user';
import { LocalStorageService } from '../../site/storage/local';
import { StorageKey } from 'src/app/shared/models/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseRestService {
  headers = new HttpHeaders().append('Content-Type', 'application/json');
  isAuth = new BehaviorSubject<boolean>(this.loggedIn());
  jwt: JwtHelperService = new JwtHelperService();
  role = new BehaviorSubject<Roles>(this.getRole());
  route = RequestRoute.auth;

  constructor(private localStorage: LocalStorageService, protected injector: Injector) {
    super(injector);
  }

  login(user: LoginUser): Observable<LoginResponse> {
    const options = {
      method: RequestMethod.post,
      body: user,
      serviceMethod: ServiceMethod.login
    } as RequestOptions;
    return this.send<LoginResponse>(options);
  }

  signInWithGoogle(user: RegisterUser): Observable<LoginResponse> {
    const options = {
      method: RequestMethod.post,
      body: user,
      serviceMethod: ServiceMethod.google
    } as RequestOptions;
    return this.send<LoginResponse>(options);
  }

  logout(): void {
    this.localStorage.removeItem(StorageKey.User);
    this.localStorage.removeItem(StorageKey.Token);
    this.localStorage.removeItem(StorageKey.Cart);
    // this.currentUser.next(null);
    this.isAuth.next(false);
  }

  register(user: RegisterUser): Observable<LoginResponse> {
    const options = {
      method: RequestMethod.post,
      body: user,
      serviceMethod: ServiceMethod.register
    } as RequestOptions;
    return this.send<LoginResponse>(options);
  }

  loggedIn(): boolean {
    return !!this.token;
  }

  changePasswordRequest(email: string): Observable<any> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.changePasswordRequest,
      params: { email }
    } as RequestOptions;
    return this.send<any>(options);
  }

  activateEmail(token: string): Observable<any> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.activateEmail,
      params: { token }
    } as RequestOptions;
    return this.send<any>(options);
  }

  sendActivationMail(): Observable<any> {
    const options = {
      method: RequestMethod.get,
      serviceMethod: ServiceMethod.sendActivationMail
    } as RequestOptions;
    return this.send<any>(options);
  }

  changePassword(token: string, id: string, password: string): Observable<any> {
    const options = {
      method: RequestMethod.post,
      serviceMethod: ServiceMethod.changePassword,
      body: {
        token,
        id,
        password
      }
    } as RequestOptions;
    return this.send<any>(options);
  }

  get token(): string {
    return this.localStorage.getItem(StorageKey.Token);
  }

  saveToken(token: string): void {
    this.localStorage.setItem(StorageKey.Token, token);
  }

  decodeToken(): any {
    return this.jwt.decodeToken(this.token);
  }

  getRole(): Roles {
    if (this.loggedIn()) {
      return this.decodeToken().role;
    } else {
      return Roles.client;
    }
  }
}
