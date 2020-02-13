import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseComponent } from './course/course.component';
import { REPORT_ROUTE } from './report.route';
import { SharedModule } from '@portal/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';

import * as fromComponents from './components';
import * as fromContainers from './containers';
import { LessonOfCourseModalComponent } from './components/lesson-of-course-modal/lesson-of-course-modal.component';
import { LoginHistoryModalComponent } from './components/login-history-modal/login-history-modal.component';
import { UserCourseModalComponent } from './components/user-course-modal/user-course-modal.component';
import { ScheduleItemModalComponent } from './components/schedule-item-modal/schedule-item-modal.component';

const COMPONENTS = [...fromComponents.components, ...fromContainers.containers];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxSpinnerModule,
    RouterModule.forChild(REPORT_ROUTE),
    NgSelectModule
  ],
  entryComponents: [
    LoginHistoryModalComponent,
    UserCourseModalComponent,
    LessonOfCourseModalComponent,
    ScheduleItemModalComponent
  ],
  declarations: [CourseComponent, ...COMPONENTS]
})
export class ReportModule {}
