import { Component, Input, OnInit } from '@angular/core';
import { DialogData, DialogType } from '../component';

@Component({
  selector: 'app-contracts-dialog',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ContractsDiaologComponent {
  @Input() dialog: DialogData;
  DialogType = DialogType;
}
