import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { stepper } from './animation';

@Component({
  selector: 'app-management',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  animations: [stepper],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManagementComponent implements OnInit {
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  prepareRoute(outlet: RouterOutlet): any {
    document.body.scrollTop = 0;
    return outlet && outlet.activatedRouteData;
  }
}
