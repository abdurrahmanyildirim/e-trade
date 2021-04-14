import { Directive, OnInit } from '@angular/core';
import { StateService } from '../shared/services/site/state';
import { PageSelector } from './model';
import { PageState } from './state';

@Directive()
export abstract class BasePageComponent<T extends PageState> implements OnInit {
  state: T;
  selector: PageSelector;
  constructor(protected stateService: StateService) {}

  ngOnInit(): void {
    this.state = this.stateService.getState(this.selector);
  }
}
