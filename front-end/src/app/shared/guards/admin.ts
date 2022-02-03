import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Roles } from '../models/user';
import { AuthService } from '../services/rest/auth/service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return new Observable((observer) => {
      if (this.authService.role.value === Roles.admin) {
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
