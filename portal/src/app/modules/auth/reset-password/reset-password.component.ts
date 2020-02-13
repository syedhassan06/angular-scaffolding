import { IResetPassword } from '@portal/core/models/user.model';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IHttpResponse } from '@portal/core/models';
import { NotificationService, AuthService } from '@portal/core/services';
import { Validator } from '@portal/shared/utils/validator';

@Component({
  selector: 'lms-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  resetKey: string;

  constructor(
    private formBuilder: FormBuilder,
    private notifyService: NotificationService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.resetKey = params.key;
    });
  }

  buildForm() {
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: ['', [Validators.minLength(6)]],
        cpassword: ['']
      },
      {
        validator: Validator.passwordMatching.bind(this)
      }
    );
  }

  onResetPassword() {
    if (this.resetPasswordForm.valid) {
      const params: IResetPassword = {
        password: this.resetPasswordForm.get('password').value,
        password_confirmation: this.resetPasswordForm.get('password').value,
        key: this.resetKey
      };
      this.authService.updatePassword(params).subscribe(
        (response: IHttpResponse) => {
          const user: any = response.data;
          if (response.status) {
            this.notifyService.success(response.message, 'Success');
            this.router.navigateByUrl('/login');
          } else {
            this.notifyService.error(response.message, 'Sorry');
          }
        },
        (err: IHttpResponse) => {
          this.notifyService.error(err.message, 'Sorry');
        }
      );
    }
  }
}
