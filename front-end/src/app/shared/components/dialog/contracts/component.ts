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
  hidden = false;

  exportContracts(): void {
    this.hidden = true;
    setTimeout(() => {
      printJS({ printable: 'pdf-content', type: 'html' });
      this.hidden = false;
    });
  }
}
