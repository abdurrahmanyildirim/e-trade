import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobileDetectionService {
  isMobile = new BehaviorSubject(document.body.clientWidth <= 750);
  mediaQuery = window.matchMedia('(max-width: 750px)');

  init(): void {
    this.mediaQuery.addEventListener('change', (event: MediaQueryListEvent) => {
      this.isMobile.next(event.matches);
    });
  }
}
