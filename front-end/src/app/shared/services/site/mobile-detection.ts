import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobileDetectionService {
  isMobile = new BehaviorSubject(document.body.clientWidth <= 650);
  mediaQuery = window.matchMedia('(max-width: 650px)');

  init(): void {
    this.mediaQuery.addEventListener('change', (event: MediaQueryListEvent) => {
      this.isMobile.next(event.matches);
    });
  }
}
