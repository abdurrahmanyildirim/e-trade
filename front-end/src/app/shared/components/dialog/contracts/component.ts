import { Component, Input } from '@angular/core';
import { DialogData, DialogType } from '../component';
import * as printJS from 'print-js';

@Component({
  selector: 'app-contracts-dialog',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ContractsDiaologComponent {
  @Input() dialog: DialogData;
  DialogType = DialogType;

  exportContracts(): void {
    printJS('contracts', 'html');
  }
}
