import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-user-info',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class UserInfoComponent {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChildren('nav') navs: QueryList<MatButton>;

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
}
