import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { isPresent } from '../../util/common';
import { DialogComponent, DialogProps } from './component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  confirm(data: DialogProps): void {
    const opts = { width: 'fit-content', maxWidth: '90%' } as MatDialogConfig;
    this.openDialog(data, opts);
  }

  message(data: DialogProps): void {
    const opts = { width: '500px', maxWidth: '90%', maxHeight: '60%' } as MatDialogConfig;
    this.openDialog(data, opts);
  }

  cartWarning(data: DialogProps): void {
    const opts = { width: 'auto', maxWidth: '90%', maxHeight: '60%' } as MatDialogConfig;
    this.openDialog(data, opts);
  }

  contracts(data: DialogProps): void {
    const opts = { width: '80%', height: '70%' } as MatDialogConfig;
    this.openDialog(data, opts);
  }

  review(data: DialogProps): void {
    const opts = { width: 'auto', maxWidth: '90%', maxHeight: '60%' } as MatDialogConfig;
    this.openDialog(data, opts);
  }

  orderUpdate(data: DialogProps): void {
    this.openDialog(data);
  }

  private openDialog(data: DialogProps, opts?: MatDialogConfig): void {
    this.dialog
      .open(DialogComponent, { data, ...opts })
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
