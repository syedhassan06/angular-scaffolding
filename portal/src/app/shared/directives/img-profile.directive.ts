import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[lmsImgProfile]'
})
export class ImgProfileDirective {
  constructor(private elementRef: ElementRef) {}

  @Input()
  set lmsImgProfile(value: {
    profile_image_type: string;
    profile_image: string;
  }) {
    const ImgElement = this.elementRef.nativeElement as HTMLImageElement;
    if (value && value.profile_image) {
      ImgElement.src =
        `data:image/${value.profile_image_type};base64,` + value.profile_image;
    } else {
      ImgElement.src = 'assets/img/user.svg';
    }
  }
}
