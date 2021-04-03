import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { Observable } from 'rxjs';
import { RegisterUser } from 'src/app/pages/auth/register/model';
import { LoginResponse } from '../../models/user';
import { AuthService } from '../rest/auth.service';

@Injectable()
export class SocialService {
  constructor(private socialAuthService: SocialAuthService, private authService: AuthService) {}

  signInWithGoogle(): Observable<LoginResponse> {
    return new Observable((observer) => {
      this.socialAuthService
        .signIn(GoogleLoginProvider.PROVIDER_ID)
        .then((user: SocialUser) => {
          const newUser = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          } as RegisterUser;
          this.authService.authWithGoogle(newUser).subscribe({
            next: (res) => {
              observer.next(res);
              observer.complete();
            },
            error: (err) => {
              observer.error(err);
            }
          });
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }
}
