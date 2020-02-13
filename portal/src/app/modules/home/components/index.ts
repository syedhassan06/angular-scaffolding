import { SettingsFormComponent } from './settings-form/settings-form.component';
import { EmailNotificationListComponent } from './email-notification-list/email-notification-list.component';
import { EmailNotificationFormComponent } from './email-notification-form/email-notification-form.component';
import { TermsConditionModalComponent } from './terms-condition-modal/terms-condition-modal.component';

export * from './email-notification-list/email-notification-list.component';
export * from './email-notification-form/email-notification-form.component';
export * from './settings-form/settings-form.component';
export * from './terms-condition-modal/terms-condition-modal.component';

export const components: any[] = [
  EmailNotificationFormComponent,
  EmailNotificationListComponent,
  SettingsFormComponent,
  TermsConditionModalComponent
];
