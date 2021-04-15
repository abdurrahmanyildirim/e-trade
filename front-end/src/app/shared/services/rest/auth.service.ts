import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginUser } from 'src/app/pages/auth/login/model';
import { RegisterUser } from 'src/app/pages/auth/register/model';
import { StorageKey } from '../../models/storage';
import { LoginResponse, Roles, User } from '../../models/user';
import { ConfigService } from '../site/config.service';
import { CryptoService } from '../site/crypto';
import { LocalStorageService } from '../site/storage/local';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  headers = new HttpHeaders().append('Content-Type', 'application/json');
  currentUser = new BehaviorSubject<User>(this.localStorage.getObject(StorageKey.User));
  isAuth = new BehaviorSubject<boolean>(this.loggedIn());
  role = new BehaviorSubject<Roles>(this.getRole());
  jwt: JwtHelperService = new JwtHelperService();

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private cryptoService: CryptoService
  ) {}

  login(user: LoginUser): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.configService.config.baseUrl + 'auth/login', user, {
      headers: this.headers
    });
  }

  authWithGoogle(user: RegisterUser): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.configService.config.baseUrl + 'auth/google', user);
  }

  logout(): void {
    this.localStorage.removeItem(StorageKey.User);
    this.localStorage.removeItem(StorageKey.Token);
    this.localStorage.removeItem(StorageKey.Cart);
    this.currentUser.next(null);
    this.isAuth.next(false);
  }

  register(user: RegisterUser): Observable<RegisterUser> {
    return this.http.post<RegisterUser>(this.configService.config.baseUrl + 'auth/register', user, {
      headers: this.headers
    });
  }

  updateContactInfo(info: any): Observable<any> {
    return this.http.post<any>(this.configService.config.baseUrl + 'user/update-contact', info);
  }

  loggedIn(): boolean {
    return !!this.token;
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(this.configService.config.baseUrl + 'auth/user/' + id).pipe(
      map((user) => {
        user.email = this.cryptoService.basicDecrypt(user.email);
        return user;
      })
    );
  }

  updateGeneralInfo(info: User): Observable<any> {
    return this.http.post<User>(this.configService.config.baseUrl + 'user/update-general', info);
  }

  updatePassword(info: any): Observable<any> {
    return this.http.post<any>(this.configService.config.baseUrl + 'user/update-password', info);
  }

  getContactInfo(): Observable<any> {
    return this.http.get<any>(this.configService.config.baseUrl + 'auth/contact-info').pipe(
      map((info) => {
        info.city = this.cryptoService.basicDecrypt(info.city);
        info.district = this.cryptoService.basicDecrypt(info.district);
        info.address = this.cryptoService.basicDecrypt(info.address);
        info.phone = this.cryptoService.basicDecrypt(info.phone);
        return info;
      })
    );
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
