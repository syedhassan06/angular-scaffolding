import { EmailNotificationsComponent } from './email-notifications/email-notifications.component';
import { EmailNotificationItemComponent } from './email-notification-item/email-notification-item.component';
import { SettingsComponent } from './settings/settings.component';

export * from './email-notifications/email-notifications.component';
export * from './email-notification-item/email-notification-item.component';
export * from './settings/settings.component';

export const containers: any[] = [
  EmailNotificationsComponent,
  EmailNotificationItemComponent,
  SettingsComponent
];
