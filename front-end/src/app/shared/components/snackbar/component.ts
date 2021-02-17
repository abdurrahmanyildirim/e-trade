import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class SnackbarComponent {
  @Input() message: string;
}
