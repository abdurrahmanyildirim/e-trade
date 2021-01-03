import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/rest/auth.service';
import { LoginUser } from './model';

@Component({
  selector: 'app-login',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginUser: LoginUser;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm(): void {
    this.loginForm = this.fb.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.loginUser = Object.assign({}, this.loginForm.value);
      console.log(this.loginUser);
      this.authService.login(this.loginUser).subscribe(
        (data) => {
          // this.authService.saveToken(data.token);
          // this.alertifyService.success('Giriş yapıldı.');
          // this.router.navigateByUrl('/chat/friends');
        },
        (err) => {
          // this.alertifyService.alert('Hatalı giriş! Lütfen tekrar deneyiniz.');
          // this.loginForm.reset();
        }
      );
    }
  }
}
