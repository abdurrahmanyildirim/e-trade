import { Component, Input } from '@angular/core';
import { DialogProps, DialogType } from '../component';
import * as printJS from 'print-js';

@Component({
  selector: 'app-contracts-dialog',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ContractsDiaologComponent {
  @Input() dialog: DialogProps;
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
