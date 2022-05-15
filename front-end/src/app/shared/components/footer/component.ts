import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfigService } from '../../services/site/config';

@Component({
  selector: 'app-footer',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  currentYear = new Date().getFullYear().toString();

  constructor(public configService: ConfigService) {}
}
