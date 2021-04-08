import { AfterViewInit, Component, ElementRef, Inject, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class DialogComponent implements AfterViewInit {
  @ViewChildren('star') stars: ElementRef<HTMLElement>[];
  currentRate;
  DialogType = DialogType;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (DialogType.Review) {
      this.currentRate = Number.parseFloat(this.data.desc);
    }
  }

  ngAfterViewInit(): void {
    if (DialogType.Review) {
      this.onMouseLeaveStar();
    }
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
    this.currentRate = Number.parseFloat(this.data.desc);
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

export interface DialogData {
  acceptButton: string;
  refuseButton?: string;
  desc: string;
  onClose: (result: any) => void;
  onError?: (error: any) => void;
  dialog: DialogType;
  data?: any;
}

export enum DialogType {
  Confirm = 'confirm',
  Message = 'message',
  Review = 'review',
  CartWarning = 'cartWarning',
  Contracts= 'contracts'
}
