import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { isPresent } from '../../util/common';
import { DialogComponent, DialogData } from './component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(public dialog: MatDialog) {}

  confirm(data: DialogData): void {
    this.dialog
      .open(DialogComponent, {
        width: 'fit-content',
        maxWidth: '90%',
        data
      })
      .afterClosed()
      .pipe(first())
      .subscribe({
        next: (result) => {
          const res = isPresent(result) ? result : false;
          data.onClose(res);
        },
        error: (err) => {
          data.onError(err);
        }
      });
  }

  message(data: DialogData): void {
    this.dialog
      .open(DialogComponent, {
        width: '500px',
        maxWidth: '90%',
        maxHeight: '60%',
        data
      })
      .afterClosed()
      .pipe(first())
      .subscribe({
        next: (result) => {
          const res = isPresent(result) ? result : false;
          data.onClose(res);
        },
        error: (err) => {
          data.onError(err);
        }
      });
  }

  cartWarning(data: DialogData): void {
    this.dialog
      .open(DialogComponent, {
        width: 'auto',
        maxWidth: '90%',
        maxHeight: '60%',
        data
      })
      .afterClosed()
      .pipe(first())
      .subscribe({
        next: (result) => {
          const res = isPresent(result) ? result : false;
          data.onClose(res);
        },
        error: (err) => {
          data.onError(err);
        }
      });
  }

  review(data: DialogData): void {
    this.dialog
      .open(DialogComponent, {
        width: 'auto',
        maxWidth: '90%',
        maxHeight: '60%',
        data
      })
      .afterClosed()
      .pipe(first())
      .subscribe({
        next: (result) => {
          const res = isPresent(result) ? result : false;
          data.onClose(res);
        },
        error: (err) => {
          data.onError(err);
        }
      });
  }
}
