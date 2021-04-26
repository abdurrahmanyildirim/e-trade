import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { stepper } from './animation';

@Component({
  selector: 'app-management',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  animations: [stepper]
})
export class ManagementComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  prepareRoute(outlet: RouterOutlet): any {
    return outlet && outlet.activatedRouteData;
  }
}
