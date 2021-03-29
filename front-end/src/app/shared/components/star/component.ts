import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarComponent {
  @Input() givenRate: number;
  @Input() height?: number;
  @Input() width?: number;
}
