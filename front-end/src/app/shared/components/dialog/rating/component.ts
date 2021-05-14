import { AfterViewInit, Component, ElementRef, Input, ViewChildren } from '@angular/core';
import { DialogData, DialogType } from '../component';

@Component({
  selector: 'app-rating-dialog',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class RatingDiaologComponent implements AfterViewInit {
  @Input() dialog: DialogData;
  @ViewChildren('star') stars: ElementRef<HTMLElement>[];
  currentRate: number;

  ngAfterViewInit(): void {
    this.onMouseLeaveStar();
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
}
