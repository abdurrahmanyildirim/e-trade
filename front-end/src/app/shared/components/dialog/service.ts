import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { isPresent } from '../../util/common';
import { DialogComponent, DialogData } from './component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(public dialog: MatDialog) {}

  openDialog(data: DialogData): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.dialog
        .open(DialogComponent, {
          width: '400px',
          data
        })
        .afterClosed()
        .subscribe({
          next: (result) => {
            const res = isPresent(result) ? result : false;
            observer.next(res);
            observer.complete();
          },
          error: (err) => {
            observer.error(err);
          }
        });
    });
  }
}
