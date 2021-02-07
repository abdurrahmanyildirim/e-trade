import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginUser } from 'src/app/pages/auth/login/model';
import { RegisterUser } from 'src/app/pages/auth/register/model';
import { StorageKey } from '../../models/storage';
import { LoginResponse, Roles, User } from '../../models/user';
import { ConfigService } from '../site/config.service';
import { LocalStorageService } from '../site/local-storage.service';

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
    private localStorage: LocalStorageService
  ) {}

  login(user: LoginUser): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.configService.config.domain + 'auth/login', user, {
      headers: this.headers
    });
  }

  logout(): void {
    this.localStorage.removeItem(StorageKey.User);
    this.localStorage.removeItem(StorageKey.Token);
    this.localStorage.removeItem(StorageKey.Cart);
    this.currentUser.next(null);
    this.isAuth.next(false);
  }

  register(user: RegisterUser): Observable<RegisterUser> {
    return this.http.post<RegisterUser>(this.configService.config.domain + 'auth/register', user, {
      headers: this.headers
    });
  }

  loggedIn(): boolean {
    return !!this.token;
  }

  get token(): string {
    return this.localStorage.getItem(StorageKey.Token);
  }

  saveToken(token: string): void {
    this.localStorage.setItem(StorageKey.Token, token);
  }

  decodeToken(): User {
    return this.jwt.decodeToken(this.token);
  }

  getRole(): Roles {
    if (this.jwt) {
      return this.jwt.decodeToken<User>(this.token).role;
    } else {
      let jwt = new JwtHelperService();
      const role = jwt.decodeToken<User>(this.token).role;
      jwt = null;
      return role;
    }
  }
}
