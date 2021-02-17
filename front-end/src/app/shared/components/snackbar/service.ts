import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from './component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showInfo(message: string): void {
    const sb = this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 1000,
      verticalPosition: 'top',
      panelClass: ['info-snackbar']
    });
    const content = sb.instance as SnackbarComponent;
    content.message = message;
  }

  showError(message: string): void {
    const sb = this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
    const content = sb.instance as SnackbarComponent;
    content.message = message;
  }

  showSuccess(message: string): void {
    const sb = this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
    const content = sb.instance as SnackbarComponent;
    content.message = message;
  }
}
