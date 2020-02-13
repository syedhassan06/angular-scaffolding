import { AppSetting, APP_CONFIG } from './configs/app-setting.config';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NxModule } from '@nrwl/nx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './modules/auth/auth.module';
import { ShellModule } from './shell/shell.module';
import { UserIdleModule } from 'angular-user-idle';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NxModule.forRoot(),
    UserIdleModule.forRoot({
      idle: AppSetting.idleTimeout * 60,
      timeout: AppSetting.sessionTimeout,
      ping: 0
    }),
    CoreModule,
    SharedModule,
    AuthModule,
    ShellModule,
    AppRoutingModule
  ],
  providers: [{ provide: APP_CONFIG, useValue: AppSetting }],
  bootstrap: [AppComponent]
})
export class AppModule {}
