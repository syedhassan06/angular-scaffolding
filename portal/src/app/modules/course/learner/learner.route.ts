import { Routes } from '@angular/router';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';

export const LEARNER_ROUTE: Routes = [
  { path: '', component: CourseListComponent },
  { path: 'detail/:courseID', component: CourseDetailComponent }
];
