import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
}

export interface DialogData {
  acceptButton: string;
  refuseButton: string;
  desc: string;
  onClose: (result: boolean) => void;
  onError?: (error: any) => void;
}
