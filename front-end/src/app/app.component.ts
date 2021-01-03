import { Component } from '@angular/core';
import { ConfigService } from './shared/services/site/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public configService: ConfigService) {}
  title = 'e-trader';
}
