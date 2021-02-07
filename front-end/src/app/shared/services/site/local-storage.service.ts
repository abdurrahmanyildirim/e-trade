import { Injectable } from '@angular/core';
import { BaseStorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService extends BaseStorageService {
  constructor() {
    super(window.localStorage);
  }
}
