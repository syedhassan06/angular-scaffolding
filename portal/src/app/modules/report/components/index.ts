import { UserCourseModalComponent } from './user-course-modal/user-course-modal.component';
import { CertificateComponent } from './certificate/certificate.component';
import { LoginHistoryModalComponent } from './login-history-modal/login-history-modal.component';
import { LessonOfCourseModalComponent } from './lesson-of-course-modal/lesson-of-course-modal.component';
import { ScheduleItemModalComponent } from './schedule-item-modal/schedule-item-modal.component';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import { ScheduleUsersDropdownComponent } from './schedule-users-dropdown/schedule-users-dropdown.component';

export * from './certificate/certificate.component';
export * from './login-history-modal/login-history-modal.component';
export * from './user-course-modal/user-course-modal.component';
export * from './lesson-of-course-modal/lesson-of-course-modal.component';
export * from './schedule-item-modal/schedule-item-modal.component';
export * from './schedule-list/schedule-list.component';
export * from './schedule-users-dropdown/schedule-users-dropdown.component';

export const components: any[] = [
  CertificateComponent,
  LoginHistoryModalComponent,
  UserCourseModalComponent,
  LessonOfCourseModalComponent,
  ScheduleItemModalComponent,
  ScheduleListComponent,
  ScheduleUsersDropdownComponent
];
