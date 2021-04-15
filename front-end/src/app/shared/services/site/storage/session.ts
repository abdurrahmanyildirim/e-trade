import { Injectable } from '@angular/core';
import { BaseStorageService } from './base';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService extends BaseStorageService {
  constructor() {
    super(window.sessionStorage);
  }
}
