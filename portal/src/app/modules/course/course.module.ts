import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '@portal/shared/shared.module';
import { COURSE_ROUTE } from './course.route';

import { LearnerContainerComponent } from './learner/learner.container.component';
import { CourseDetailComponent } from './learner/course-detail/course-detail.component';
import { CourseListComponent } from './learner/course-list/course-list.component';

// containers
import * as fromCourseAdminContainers from './admin/containers';
// components
import * as fromCourseAdminComponents from './admin/components';
import { AssignmentModalComponent } from './admin/components/assignment-modal/assignment-modal.component';
import { AssignmentGradingModalComponent } from './admin/components/assignment-grading-modal/assignment-grading-modal.component';
import { LearnerAssignmentComponent } from './learner/course-detail/components';
import { SelectedSubmitAssignmentPipe } from './learner/course-detail/pipes';

const COMPONENTS = [
  CourseDetailComponent,
  CourseListComponent,
  LearnerContainerComponent,
  LearnerAssignmentComponent,
  ...fromCourseAdminContainers.containers,
  ...fromCourseAdminComponents.components
];

const ENTRY_COMPONENTS = [
  AssignmentModalComponent,
  AssignmentGradingModalComponent
];

@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    RouterModule.forChild(COURSE_ROUTE),
    SharedModule
  ],
  declarations: [
    ...COMPONENTS,
    AssignmentGradingModalComponent,
    SelectedSubmitAssignmentPipe
  ],
  entryComponents: [...ENTRY_COMPONENTS]
})
export class CourseModule {}
