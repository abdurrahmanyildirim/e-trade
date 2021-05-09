import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/rest/user/service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder.service';
import { nullValidator } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';

@Component({
  selector: 'app-general',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class GeneralComponent implements OnInit, OnDestroy {
  form: FormGroup;
  user: User;

  constructor(
    private fb: FormBuilder,
    private screenHolder: ScreenHolderService,
    private snackbar: SnackbarService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initUserInfo();
  }

  initForm(): void {
    this.form = this.fb.group({
      firstName: new FormControl(this.user.firstName, [
        Validators.required,
        Validators.maxLength(30),
        nullValidator()
      ]),
      lastName: new FormControl(this.user.lastName, [
        Validators.required,
        Validators.maxLength(30),
        nullValidator()
      ]),
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.email,
        nullValidator()
      ])
    });
  }

  initUserInfo(): void {
    this.userService.getUser().subscribe({
      next: (user) => {
        this.user = user;
        this.initForm();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  update(): void {
    if (this.form.invalid) {
      return;
    }
    this.screenHolder.show();
    const info = Object.assign({}, this.form.value);
    this.userService.updateGeneralInfo(info).subscribe({
      next: (res) => {
        this.screenHolder.hide();
        this.snackbar.showSuccess('Bilgileriniz güncellendi.');
      },
      error: (err) => {
        console.log(err);
        this.screenHolder.hide();
        this.snackbar.showError(err.error.message);
        this.form.patchValue(this.user);
      }
    });
  }

  ngOnDestroy(): void {
    ObjectHelper.removeReferances(this);
  }
}
