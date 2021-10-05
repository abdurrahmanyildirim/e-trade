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
import { DialogProps } from '../component';

@Component({
  selector: 'app-rating-dialog',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingDiaologComponent implements OnInit, OnDestroy {
  @Input() dialog: DialogProps;
  @ViewChildren('star') stars: ElementRef<HTMLElement>[];
  commentInfo = {
    currentRate: 0,
    desc: ''
  };

  ngOnInit(): void {
    this.commentInfo.currentRate = this.dialog.rate;
    this.commentInfo.desc = this.dialog.desc;
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
  }

  onMouseLeaveStar(): void {
    this.stars.forEach((star, index) => {
      if (this.commentInfo.currentRate > index) {
        star.nativeElement.classList.remove('empty-star-icon');
        star.nativeElement.classList.add('star-icon');
      } else {
        star.nativeElement.classList.add('empty-star-icon');
        star.nativeElement.classList.remove('star-icon');
      }
    });
  }

  onRateClick(rate: number): void {
    this.commentInfo.currentRate = rate;
    this.stars.forEach((star, index) => {
      if (this.commentInfo.currentRate > index) {
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
