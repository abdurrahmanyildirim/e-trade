import { Component, Input } from '@angular/core';
import { DialogProps } from '../component';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmDialogComponent {
  @Input() dialog: DialogProps;
}
