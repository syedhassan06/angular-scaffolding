import { DealershipReportComponent } from './dealership-report/dealership-report.component';
import { CourseCompletionComponent } from './course-completion/course-completion.component';
import { CourseProgressComponent } from './course-progress/course-progress.component';
import { CourseRegistrationComponent } from './course-registration/course-registration.component';
import { AllCoursesComponent } from './all-courses/all-courses.component';
import { ReportsComponent } from './reports/reports.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { CourseCertificateComponent } from './course-certificate/course-certificate.component';
import { LessonReportComponent } from './lesson-report/lesson-report.component';
import { ReportCardComponent } from './report-card/report-card.component';
import { ActivityReportComponent } from './activity-report/activity-report.component';
import { ScheduleComponent } from './schedule/schedule.component';

export * from './schedule/schedule.component';
export * from './reports/reports.component';
export * from './course-registration/course-registration.component';
export * from './all-courses/all-courses.component';
export * from './course-progress/course-progress.component';
export * from './course-completion/course-completion.component';
export * from './user-login/user-login.component';
export * from './user-registration/user-registration.component';
export * from './course-certificate/course-certificate.component';
export * from './dealership-report/dealership-report.component';
export * from './lesson-report/lesson-report.component';
export * from './report-card/report-card.component';
export * from './activity-report/activity-report.component';

export const containers: any[] = [
  CourseRegistrationComponent,
  AllCoursesComponent,
  ReportsComponent,
  CourseCompletionComponent,
  CourseProgressComponent,
  UserLoginComponent,
  UserRegistrationComponent,
  CourseCertificateComponent,
  DealershipReportComponent,
  LessonReportComponent,
  ReportCardComponent,
  ActivityReportComponent,
  ScheduleComponent
];
