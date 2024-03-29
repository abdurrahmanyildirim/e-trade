import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/rest/auth/service';

@Injectable()
export class UnAuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return new Observable((observer) => {
      if (!this.authService.loggedIn()) {
        observer.next(true);
        observer.complete();
      } else {
        this.router.navigate(['/main']);
        observer.next(false);
        observer.complete();
      }
    });
  }
}
