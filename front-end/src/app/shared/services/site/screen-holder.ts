import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenHolderService {
  private element: HTMLElement;

  constructor() {
    this.element = document.getElementById('screen-holder');
  }

  show(): void {
    this.element.style.display = 'flex';
  }

  hide(): void {
    this.element.style.display = 'none';
  }
}
