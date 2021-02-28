import { AbstractControl, ValidationErrors } from '@angular/forms';

export function isPresent(obj: any): boolean {
  return obj !== undefined && typeof obj !== 'undefined' && obj !== null;
}

export function nullValidator(): (AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    return !!control.parent && !!control.parent.value && (control.value + '').trim().length > 0
      ? null
      : { isNull: { value: false } };
  };
}
