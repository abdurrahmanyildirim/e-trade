import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageKey } from '../../models/storage';
import { isPresent } from '../../util/common';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  state: any;
  constructor(private localStorage: LocalStorageService, private http: HttpClient) {}

  init(): Observable<void> {
    return new Observable((observer) => {
      try {
        this.state = this.localStorage.getObject<any>(StorageKey.State);
        if (isPresent(this.state)) {
          observer.next();
          observer.complete();
        } else {
          this.initDefaultState().subscribe(() => {
            observer.next();
            observer.complete();
          });
        }
      } catch (error) {
        console.log(error);
        observer.error(error);
      }
    });
  }

  getState(selector: string): any {
    return isPresent(this.state) && isPresent(this.state[selector]) ? this.state[selector] : null;
  }

  setState(selector: string, newState: any): void {
    this.state[selector] = newState;
    this.localStorage.setObject(StorageKey.State, this.state);
  }

  private initDefaultState(): Observable<void> {
    return new Observable((observer) => {
      this.http.get<any>(`assets/config/pages.json`).subscribe((state) => {
        this.state = state;
        observer.next();
      });
    });
  }
}