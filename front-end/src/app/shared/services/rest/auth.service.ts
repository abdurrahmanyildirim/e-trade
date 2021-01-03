import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginUser } from 'src/app/pages/auth/login/model';
import { ConfigService } from '../site/config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  headers = new HttpHeaders().append('Content-Type', 'application/json');

  constructor(private configService: ConfigService, private http: HttpClient) {}

  login(loginUser: LoginUser): Observable<any> {
    return this.http.post<LoginUser>(this.configService.config.domain + 'auth/login', loginUser, {
      headers: this.headers
    });
  }

  loggedIn(): boolean {
    return false;
  }
}
