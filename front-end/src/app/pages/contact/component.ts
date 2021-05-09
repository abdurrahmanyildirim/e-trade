import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { Contact } from 'src/app/shared/models/contact';
import { ContactService } from 'src/app/shared/services/rest/contact/service';
import { nullValidator } from 'src/app/shared/util/common';

@Component({
  selector: 'app-contact',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements OnInit {
  contact: Contact;
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private snackbar: SnackbarService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required, nullValidator()]),
      email: new FormControl('', [Validators.required, nullValidator(), Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        nullValidator(),
        Validators.maxLength(14),
        Validators.minLength(14)
      ]),
      desc: new FormControl('', [Validators.required, nullValidator()])
    });
    this.cd.detectChanges();
  }

  onKeypress(): void {
    setTimeout(() => {
      const phone = this.form.value.phone.split(' ').join('');
      let maskedPhone = '';
      for (let i = 0; i < phone.length; i++) {
        maskedPhone += phone[i];
        if (i === 3 || i === 6 || i === 8) {
          maskedPhone += ' ';
        }
      }
      this.form.patchValue({
        phone: maskedPhone
      });
    });
  }

  sendContactRequest(): void {
    if (this.form.invalid) {
      return;
    }
    this.contact = Object.assign({}, this.form.value);
    this.contactService.contactRequest(this.contact).subscribe({
      next: (res) => {
        this.form.reset();
        Object.keys(this.form.controls).forEach((key) => {
          this.form.controls[key].setErrors(null);
        });
        this.snackbar.showSuccess('Mesajınız iletildi. Kısa sürede iletişimi geçilecektir');
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
