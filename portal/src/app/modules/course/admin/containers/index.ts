import { CourseItemComponent } from './course-item/course-item.component';
import { CourseManageComponent } from './course-manage/course-manage.component';
import { CourseContentComponent } from './course-content/course-content.component';
import { CoursePackageComponent } from './course-package/course-package.component';
import { CourseDashboardComponent } from './course-dashboard/course-dashboard.component';
import { CourseRoasterComponent } from './course-roaster/course-roaster.component';
import { AssignmentManageComponent } from './assignment-manage/assignment-manage.component';

export * from './course-package/course-package.component';
export * from './course-content/course-content.component';
export * from './course-item/course-item.component';
export * from './course-manage/course-manage.component';
export * from './course-dashboard/course-dashboard.component';
export * from './course-roaster/course-roaster.component';
export * from './assignment-manage/assignment-manage.component';

export const containers: any[] = [
  CourseItemComponent,
  CourseManageComponent,
  CourseContentComponent,
  CourseRoasterComponent,
  CoursePackageComponent,
  CourseDashboardComponent,
  AssignmentManageComponent
];
