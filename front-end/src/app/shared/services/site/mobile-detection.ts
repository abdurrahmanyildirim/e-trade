import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobileDetectionService {
  isMobile = new BehaviorSubject(false);
  mediaQuery = window.matchMedia('(hover:none)');

  init(): void {
    // this.mediaQuery.addEventListener('change', (event: MediaQueryListEvent) => {
    //   this.isMobile.next(event.matches);
    // });
    this.isMobile.next(this.mediaQuery.matches);
  }
}
