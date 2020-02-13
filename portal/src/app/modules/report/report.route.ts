import { CourseComponent } from './course/course.component';
import { Routes } from '@angular/router';
import * as fromContainers from './containers';

export const REPORT_ROUTE: Routes = [
  { path: 'schedule', component: fromContainers.ScheduleComponent },
  { path: 'course', component: CourseComponent },
  { path: 'all-course', component: fromContainers.AllCoursesComponent },
  {
    path: 'course-registration',
    component: fromContainers.CourseRegistrationComponent
  },
  {
    path: 'course-progress',
    component: fromContainers.CourseProgressComponent
  },
  {
    path: 'course-completion',
    component: fromContainers.CourseCompletionComponent
  },
  {
    path: 'user-registration',
    component: fromContainers.UserRegistrationComponent
  },
  {
    path: 'user-login',
    component: fromContainers.UserLoginComponent
  },
  {
    path: 'course-certificate',
    component: fromContainers.CourseCertificateComponent
  },
  {
    path: 'dealership',
    component: fromContainers.DealershipReportComponent
  },
  {
    path: 'lesson',
    component: fromContainers.LessonReportComponent
  },
  {
    path: 'report-card',
    component: fromContainers.ReportCardComponent
  },
  {
    path: 'activity',
    component: fromContainers.ActivityReportComponent
  },
  {
    path: '',
    component: fromContainers.ReportsComponent
  }
];
