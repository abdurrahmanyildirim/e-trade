import { Component, OnDestroy } from '@angular/core';
import { ObjectHelper } from 'src/app/shared/util/helper/object';

@Component({
  selector: 'app-user-info',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class UserInfoComponent implements OnDestroy {
  ngOnDestroy(): void {
    ObjectHelper.removeReferances(this);
  }
}
