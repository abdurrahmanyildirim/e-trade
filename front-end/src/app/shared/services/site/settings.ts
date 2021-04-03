import { Injectable } from '@angular/core';
import { StorageKey } from '../../models/storage';
import { LoginResponse } from '../../models/user';
import { AuthService } from '../rest/auth.service';
import { CartService } from '../rest/cart.service';
import { LocalStorageService } from './local-storage.service';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SettingService {
  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private localStorage: LocalStorageService,
    private location: Location
  ) {}

  initUserSettingsAfterLogin(loginResponse: LoginResponse): void {
    this.localStorage.setObject(StorageKey.User, loginResponse.info);
    this.authService.saveToken(loginResponse.token);
    this.authService.currentUser.next(loginResponse.info);
    this.authService.isAuth.next(true);
    this.cartService.init().subscribe(() => {
      this.localStorage.removeItem(StorageKey.Cart);
      this.authService.role.next(this.authService.getRole());
      this.location.back();
    });
  }
}
