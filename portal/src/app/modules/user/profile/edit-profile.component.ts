import { Router } from '@angular/router';
import { IHttpResponse } from './../../../core/models/index';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@portal/core/services';
import { Validator } from '@portal/shared/utils/validator';
import { UserService } from '@portal/core/services/user.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'lms-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {
  @ViewChild('inputFile') inputFile;
  imgURL;
  selectedFile = null;
  userProfileForm: FormGroup;
  userPasswordForm: FormGroup;
  user = null;
  imagePath;
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private notifyService: NotificationService,
    private userService: UserService,
    private router: Router
  ) {
    this.buildForm();
    this.fetchProfile();
  }

  ngOnInit() {}

  fetchProfile() {
    this.userService
      .getProfile()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response.status) {
          this.user = response.data;
          this.userProfileForm.patchValue(this.user);
        }
      });
  }

  buildForm() {
    this.userProfileForm = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address_street1: [''],
      address_street2: [''],
      country: [{ value: 'USA', disabled: true }],
      city: [''],
      state: [''],
      zip: [''],
      landline: [''],
      mobile: ['']
    });
    this.userPasswordForm = this.formBuilder.group(
      {
        password: ['', [Validators.minLength(6)]],
        cpassword: ['']
      },
      {
        validator: Validator.passwordMatching.bind(this)
      }
    );
  }

  onSave() {
    this.hasFile();
    const formData = new FormData();

    if (this.userProfileForm.valid) {
      const data = { ...this.userProfileForm.value };
      const password: string = this.userPasswordForm.get('password').value;
      if (this.userPasswordForm.valid && password && password.trim() !== '') {
        data['password'] = password;
      }
      Object.keys(data).forEach(keyIndex => {
        if (!data[keyIndex]) {
          data[keyIndex] = '';
        }
        formData.append(keyIndex, data[keyIndex]);
      });
      if (this.selectedFile) {
        formData.append('profile_image', this.selectedFile);
      }
      this.userService
        .updateProfile(formData, this.user.id)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((response: IHttpResponse) => {
          if (response.status) {
            this.notifyService.success(response.message, 'Success');
            this.router.navigateByUrl('user/profile');
          } else {
            this.notifyService.error(response.message, 'Error');
          }
        });
    }
    //this.profileUpdateEmitter$.emit(value);
  }

  hasFile() {
    const fileList = this.inputFile.nativeElement.files;
    if (fileList.length > 0) {
      this.selectedFile = fileList[0];
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  preview(files) {
    if (files.length === 0) return;

    // const mimeType = files[0].type;
    // if (mimeType.match(/image\/*/) == null) {
    //   this.message = "Only images are supported.";
    //   return;
    // }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
      this.imgURL = reader.result;
    };
  }
}
