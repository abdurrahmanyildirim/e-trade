import { AfterViewInit, Component, ElementRef, Inject, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class DialogComponent {
  DialogType = DialogType;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
}

export interface DialogData {
  acceptButton: string;
  refuseButton?: string;
  desc: string;
  rate?: number;
  onClose: (result: any) => void;
  onError?: (error: any) => void;
  type: DialogType;
  data?: any;
}

export enum DialogType {
  Confirm = 'confirm',
  Message = 'message',
  Rating = 'rating',
  CartWarning = 'cartWarning',
  SalesAndInformationContract = 'SalesAndInformationContract',
  RegisterContract = 'RegisterContract'
}
