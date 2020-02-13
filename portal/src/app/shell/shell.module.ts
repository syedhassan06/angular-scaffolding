import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ShellComponent } from './shell.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeModule } from '@portal/modules/home/home.module';
import { SHELL_ROUTE } from './shell.route';
import { SharedModule } from '@portal/shared/shared.module';
import { TermsConditionModalComponent } from '@portal/modules/home/components';
import { AccountSwitcherComponent } from './account-switcher/account-switcher.component';
import { LessonContentModalComponent } from '@portal/shared/components/lesson-content-modal/lesson-content-modal.component';
import { SessionTimeoutDialogComponent } from './session-timeout-dialog/session-timeout-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    HomeModule,
    SharedModule,
    RouterModule.forChild(SHELL_ROUTE)
  ],
  entryComponents: [
    TermsConditionModalComponent,
    LessonContentModalComponent,
    SessionTimeoutDialogComponent
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    ShellComponent,
    SidebarComponent,
    AccountSwitcherComponent,
    LessonContentModalComponent,
    SessionTimeoutDialogComponent
  ]
})
export class ShellModule {}
