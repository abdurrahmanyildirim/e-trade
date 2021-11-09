import { Component, Input } from '@angular/core';
import { DialogProps, DialogType } from '../component';

@Component({
  selector: 'app-contracts-dialog',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ContractsDiaologComponent {
  @Input() dialog: DialogProps;
  DialogType = DialogType;
}
