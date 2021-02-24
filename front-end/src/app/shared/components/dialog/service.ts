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

  openDialog(data: DialogData): void {
    this.dialog
      .open(DialogComponent, {
        width: '400px',
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
