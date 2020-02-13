import { Routes } from '@angular/router';
import { LearnerContainerComponent } from './learner/learner.container.component';
import { COURSE_ADMIN_ROUTE } from './admin/course-admin.route';
import { LEARNER_ROUTE } from './learner/learner.route';

export const COURSE_ROUTE: Routes = [
  {
    path: 'learner',
    component: LearnerContainerComponent,
    children: LEARNER_ROUTE
  },
  {
    path: '',
    children: COURSE_ADMIN_ROUTE
  }
];
