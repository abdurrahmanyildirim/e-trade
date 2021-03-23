import { NgModule } from '@angular/core';
import { UserInfoComponent } from './component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GeneralComponent } from './general/component';
import { PasswordUpdateComponent } from './password/component';
import { MatStepperModule } from '@angular/material/stepper';
import { ContactComponent } from './contact/component';

@NgModule({
  declarations: [UserInfoComponent, GeneralComponent, PasswordUpdateComponent, ContactComponent],
  imports: [
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatStepperModule,
    ReactiveFormsModule
  ],
  exports: [UserInfoComponent]
})
export class UserInfoModule {}
