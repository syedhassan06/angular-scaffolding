import { Directive, HostBinding, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[lmsValidationBorder]'
})
export class ValidationBorderDirective {
  constructor(@Self() private ngControl: NgControl) {}

  @HostBinding('class.is-invalid')
  get borderClass() {
    return this.ngControl.touched && this.ngControl.invalid;
  }
}
