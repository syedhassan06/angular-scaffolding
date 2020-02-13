import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [LoginComponent, ResetPasswordComponent]
})
export class AuthModule {}
