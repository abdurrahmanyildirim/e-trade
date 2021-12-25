import { HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
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
  role = new BehaviorSubject<Roles>(this.getRole());
  jwt: JwtHelperService = new JwtHelperService();
  route = RequestRoute.auth;

  constructor(
    private localStorage: LocalStorageService,
    private socialAuthService: SocialAuthService,
    protected injector: Injector
  ) {
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

  signInWithGoogle(): Observable<LoginResponse> {
    return new Observable((observer) => {
      this.socialAuthService
        .signIn(GoogleLoginProvider.PROVIDER_ID)
        .then((user: SocialUser) => {
          const newUser = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          } as RegisterUser;
          this.authWithGoogle(newUser).subscribe({
            next: (res) => {
              observer.next(res);
              observer.complete();
            },
            error: (err) => {
              observer.error(err);
            }
          });
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }

  private authWithGoogle(user: RegisterUser): Observable<LoginResponse> {
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
      if (this.jwt) {
        return this.jwt.decodeToken(this.token).role;
      } else {
        let jwt = new JwtHelperService();
        const role = jwt.decodeToken(this.token).role;
        jwt = null;
        return role;
      }
    } else {
      return Roles.client;
    }
  }
}
