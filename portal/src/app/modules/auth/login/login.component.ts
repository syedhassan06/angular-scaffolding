import { shrinkAnimation } from '@portal/shared/utils/animate';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser, ILogin, IHttpResponse } from './../../../core/models';
import { AuthService, NotificationService } from './../../../core/services';

@Component({
  selector: 'lms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [shrinkAnimation]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  isLoginForm = true;

  constructor(
    private formBuilder: FormBuilder,
    private notifyService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.buildForm();
  }
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent | any) {
    const x = event.charCode;
    if (<any>x === 13) {
      this.onLoggedIn();
    }
  }
  ngOnInit() {}

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onLoggedIn() {
    if (this.loginForm.valid) {
      const params: ILogin = this.loginForm.value;
      this.authService.login(params).subscribe(
        (response: IHttpResponse) => {
          const user: IUser = response.data;
          if (response.status) {
            this.notifyService.success(response.message, 'Welcome');
            let isAdministrator = false;
            if (user.roles && Array.isArray(user.roles)) {
              isAdministrator = user.roles.find(role =>
                ['Admin', 'Manager'].includes(role)
              );
            }
            if (isAdministrator) {
              this.router.navigate(['admin-dashboard']);
            } else if (user.roles.includes('Learner')) {
              this.router.navigate(['dashboard']);
            }
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

  onSendEmail() {
    if (this.forgotPasswordForm.valid) {
      const params: { email: string } = this.forgotPasswordForm.value;
      this.authService.sendPasswordEmail(params.email).subscribe(
        (response: IHttpResponse) => {
          const user: IUser = response.data;
          if (response.status) {
            this.notifyService.success(response.message, 'Welcome');
            this.isLoginForm = true;
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
