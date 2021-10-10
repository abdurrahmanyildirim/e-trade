import { Component } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PageComponent {
  scrollToTop(): void {
    document.body.scrollTop = 0;
  }
}
