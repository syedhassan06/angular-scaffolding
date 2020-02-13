import { Routes } from '@angular/router';

// containers
import * as fromCourseAdminContainers from './containers';

export const COURSE_ADMIN_ROUTE: Routes | any = [
  {
    path: 'manage-list',
    component: fromCourseAdminContainers.CourseManageComponent
  },
  { path: 'create', component: fromCourseAdminContainers.CourseItemComponent },
  {
    path: 'edit/:courseID',
    component: fromCourseAdminContainers.CourseItemComponent
  },
  {
    path: ':courseID',
    component: fromCourseAdminContainers.CoursePackageComponent,
    children: [
      {
        path: '',
        component: fromCourseAdminContainers.CourseDashboardComponent
      },
      {
        path: 'dashboard',
        component: fromCourseAdminContainers.CourseDashboardComponent
      },
      {
        path: 'content',
        component: fromCourseAdminContainers.CourseContentComponent,
        data: { title: 'Manage Course Content' }
      },
      {
        path: 'assignment',
        component: fromCourseAdminContainers.AssignmentManageComponent
      },
      {
        path: 'roster',
        component: fromCourseAdminContainers.CourseRoasterComponent,
        data: { title: 'Course Roster' }
      }
    ]
  }
];
