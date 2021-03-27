import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatStepper } from '@angular/material/stepper';
import { ObjectHelper } from 'src/app/shared/util/helper/object';

@Component({
  selector: 'app-user-info',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class UserInfoComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChildren('nav') navs: QueryList<MatButton>;

  ngOnInit(): void {}

  changeStep(index: number): void {
    this.stepper.reset();
    this.stepper.selectedIndex = index;
    this.navs.forEach((nav, i) => {
      if (i !== index) {
        nav._elementRef.nativeElement.classList.remove('active');
      } else {
        nav._elementRef.nativeElement.classList.add('active');
      }
    });
  }

  ngOnDestroy(): void {
    ObjectHelper.removeReferances(this);
  }
}
