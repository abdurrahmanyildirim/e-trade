import { Directive, OnDestroy, OnInit } from '@angular/core';
import { StateService } from '../shared/services/site/state';
import { ObjectHelper } from '../shared/util/helper/object';
import { PageSelector } from './model';
import { PageState } from './state';

@Directive()
export abstract class BasePageDirective<T extends PageState> implements OnInit, OnDestroy {
  state: T;
  selector: PageSelector;
  constructor(protected stateService: StateService) {}

  ngOnInit(): void {
    this.state = this.stateService.getState(this.selector);
  }

  public saveState(): void {
    this.stateService.setState(this.selector, this.state);
  }

  ngOnDestroy(): void {
    ObjectHelper.removeReferances(this);
  }
}
