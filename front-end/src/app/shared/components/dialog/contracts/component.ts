import { Component, Input } from '@angular/core';
import { DialogData } from '../component';

@Component({
  selector: 'app-contracts-dialog',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ContractsDiaologComponent {
  @Input() dialog: DialogData;
}
