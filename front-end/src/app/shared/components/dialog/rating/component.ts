import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChildren
} from '@angular/core';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { DialogData } from '../component';

@Component({
  selector: 'app-rating-dialog',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingDiaologComponent implements OnInit, OnDestroy {
  @Input() dialog: DialogData;
  @ViewChildren('star') stars: ElementRef<HTMLElement>[];
  currentRate: number;

  ngOnInit(): void {
    this.currentRate = Number.parseFloat(this.dialog.desc);
  }

  onMouseOverStar(order: number): void {
    this.stars.forEach((star, index) => {
      if (order >= index) {
        star.nativeElement.classList.remove('empty-star-icon');
        star.nativeElement.classList.add('star-icon');
      } else {
        star.nativeElement.classList.add('empty-star-icon');
        star.nativeElement.classList.remove('star-icon');
      }
    });
    this.currentRate = order + 1;
  }

  onMouseLeaveStar(): void {
    this.currentRate = Number.parseFloat(this.dialog.desc);
    this.stars.forEach((star, index) => {
      if (this.currentRate > index) {
        star.nativeElement.classList.remove('empty-star-icon');
        star.nativeElement.classList.add('star-icon');
      } else {
        star.nativeElement.classList.add('empty-star-icon');
        star.nativeElement.classList.remove('star-icon');
      }
    });
  }

  ngOnDestroy(): void {
    ObjectHelper.removeReferances(this);
  }
}
