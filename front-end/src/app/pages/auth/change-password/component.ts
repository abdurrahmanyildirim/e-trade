import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { AuthService } from 'src/app/shared/services/rest/auth/service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ChangePasswordComponent implements OnInit {
  token: string = '';
  id: string;
  password = '';
  rePassword = '';
  isMatched = false;

  constructor(
    private authService: AuthService,
    private screenHolderService: ScreenHolderService,
    private snackBarservice: SnackbarService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params['v1'];
      this.id = params['id'];
    });
  }

  onButtonClick(): void {
    this.screenHolderService.show();
    timer(1000).subscribe(() => {
      this.authService.changePassword(this.token, this.id, this.password).subscribe({
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
    });
  }

  onKeyup(): void {
    if (this.password === this.rePassword && this.password.trim() !== '') {
      this.isMatched = true;
    } else {
      this.isMatched = false;
    }
  }
}
