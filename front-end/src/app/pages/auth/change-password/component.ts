import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { AuthService } from 'src/app/shared/services/rest/auth/service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder';
import { isPresent } from 'src/app/shared/util/common';

@Component({
  selector: 'app-change-password',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  token = '';
  id: string;
  password = '';
  rePassword = '';
  isMatched = false;
  subs = new Subscription();

  constructor(
    private authService: AuthService,
    private screenHolderService: ScreenHolderService,
    private snackBarservice: SnackbarService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const subs = this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params['v1'];
      this.id = params['id'];
    });
    this.subs.add(subs);
  }

  onButtonClick(): void {
    this.screenHolderService.show();
    const subs = this.authService
      .changePassword(this.token, this.id, this.password)
      .pipe(delay(1000))
      .subscribe({
        next: () => {
          this.screenHolderService.hide();
          this.snackBarservice.showSuccess(
            'Şifreniz değiştirildi. Yeni şifre ile giriş yapabilirsiniz.'
          );
          this.router.navigateByUrl('auth/login');
        },
        error: (error) => {
          this.screenHolderService.hide();
          this.snackBarservice.showError(error.error.message);
          console.error(error);
        }
      });
    this.subs.add(subs);
  }

  onKeyup(): void {
    if (this.password === this.rePassword && this.password.trim() !== '') {
      this.isMatched = true;
    } else {
      this.isMatched = false;
    }
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
