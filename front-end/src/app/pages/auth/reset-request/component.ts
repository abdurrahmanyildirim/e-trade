import { Component } from '@angular/core';
import { delay } from 'rxjs/operators';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { AuthService } from 'src/app/shared/services/rest/auth/service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder';

@Component({
  selector: 'app-reset-request',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ResetRequestComponent {
  isSendedRequest = false;
  email: string;

  constructor(
    private authService: AuthService,
    private screenHolderService: ScreenHolderService,
    private snackBarservice: SnackbarService
  ) {}

  onButtonClick(): void {
    this.screenHolderService.show();
    this.authService
      .changePasswordRequest(this.email)
      .pipe(delay(1000))
      .subscribe({
        next: () => {
          this.email = '';
          this.isSendedRequest = true;
          this.screenHolderService.hide();
        },
        error: (error) => {
          this.screenHolderService.hide();
          this.email = '';
          this.snackBarservice.showError(error.error.message);
          console.error(error);
        }
      });
  }
}
