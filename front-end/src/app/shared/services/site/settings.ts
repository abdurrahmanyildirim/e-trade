import { Injectable } from '@angular/core';
import { StorageKey } from '../../models/storage';
import { LoginResponse } from '../../models/user';
import { AuthService } from '../rest/auth/service';
import { CartService } from '../rest/cart/service';
import { LocalStorageService } from './storage/local';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SettingService {
  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private localStorage: LocalStorageService
  ) {}

  initUserSettingsAfterLogin(loginResponse: LoginResponse): Observable<void> {
    return new Observable((observer) => {
      this.localStorage.setObject(StorageKey.User, loginResponse.info);
      this.authService.saveToken(loginResponse.token);
      this.authService.isAuth.next(true);
      const subs = this.cartService.init().subscribe({
        next: () => {
          this.localStorage.removeItem(StorageKey.Cart);
          this.authService.role.next(this.authService.getRole());
          observer.next();
          subs.unsubscribe();
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}
