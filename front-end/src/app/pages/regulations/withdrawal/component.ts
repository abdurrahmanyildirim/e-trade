import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-withdrawal-page',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WithdrawalPageComponent {}
