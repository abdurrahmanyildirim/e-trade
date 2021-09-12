import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { stepper } from './animation';
import { ManagementFactory } from './factory';
import { Tab } from './model';

@Component({
  selector: 'app-management',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  animations: [stepper],
  viewProviders: [ManagementFactory],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManagementComponent implements OnInit {
  tabs: Tab[];
  constructor(private managemantFactory: ManagementFactory) {}

  ngOnInit(): void {
    this.tabs = this.managemantFactory.create();
  }

  prepareRoute(outlet: RouterOutlet): any {
    document.body.scrollTop = 0;
    return outlet && outlet.activatedRouteData;
  }
}
