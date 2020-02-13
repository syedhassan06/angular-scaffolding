import { CoursePlaceholderComponent } from './course-placeholder/course-placeholder.component';
import { CourseItemFormComponent } from './course-item-form/course-item-form.component';
import { AssignmentModalComponent } from './assignment-modal/assignment-modal.component';
import { AssignmentListComponent } from './assignment-list/assignment-list.component';
import { SubmittedAssignmentListComponent } from './submitted-assignment-list/submitted-assignment-list.component';
import { AssignmentGradingModalComponent } from './assignment-grading-modal/assignment-grading-modal.component';

export * from './course-item-form/course-item-form.component';
export * from './course-placeholder/course-placeholder.component';
export * from './assignment-modal/assignment-modal.component';
export * from './assignment-list/assignment-list.component';
export * from './submitted-assignment-list/submitted-assignment-list.component';
export * from './assignment-grading-modal/assignment-grading-modal.component';

export const components: any[] = [
  CourseItemFormComponent,
  CoursePlaceholderComponent,
  AssignmentModalComponent,
  AssignmentListComponent,
  SubmittedAssignmentListComponent,
  AssignmentGradingModalComponent
];
