import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { UserService } from 'src/app/shared/services/rest/user/service';
import { ScreenHolderService } from 'src/app/shared/services/site/screen-holder';
import { isPresent, nullValidator } from 'src/app/shared/util/common';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { City, UserInfo } from './model';

@Component({
  selector: 'app-general',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class GeneralComponent implements OnInit, OnDestroy {
  form: FormGroup;
  user: UserInfo;
  cities: City[];
  selectedCity: City;
  subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private screenHolder: ScreenHolderService,
    private snackbar: SnackbarService,
    private userService: UserService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initUser();
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
      city: new FormControl(this.user.city, [Validators.required, nullValidator()]),
      district: new FormControl(this.user.district, [Validators.required, nullValidator()]),
      address: new FormControl(this.user.address, [Validators.required, nullValidator()]),
      phone: new FormControl(this.user.phone, [
        Validators.required,
        Validators.maxLength(13),
        Validators.minLength(13),
        nullValidator()
      ])
      // email: new FormControl(this.user.email, [
      //   Validators.required,
      //   Validators.email,
      //   nullValidator()
      // ])
    });
  }

  initUser(): void {
    const subs = this.userService.getUser().subscribe({
      next: (user) => {
        this.user = user;
        this.initCities();
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.subs.add(subs);
  }

  update(): void {
    if (this.form.invalid) {
      return;
    }
    this.screenHolder.show();
    const info = Object.assign({}, this.form.value);
    const subs = this.userService.update(info).subscribe({
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
    this.subs.add(subs);
  }

  initCities(): void {
    const sub = this.http.get<City[]>('assets/mock/cities.json').subscribe({
      next: (cities) => {
        this.cities = cities.sort((a, b) => a.city.localeCompare(b.city));
        this.user.city ? '' : (this.user.city = 'İstanbul');
        this.selectedCity = cities.find((c) => c.city === this.user.city);
        this.selectedCity.districts.sort((a, b) => a.localeCompare(b));
        this.initForm();
      },
      error: (err) => {
        console.error(err);
      }
    });
    this.subs.add(sub);
  }

  onCityChange(city: MatSelectChange): void {
    this.selectedCity = this.cities.slice().find((c) => c.city === city.value);
    this.selectedCity.districts.sort((a, b) => a.localeCompare(b));
    this.form.patchValue({ district: '' });
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
