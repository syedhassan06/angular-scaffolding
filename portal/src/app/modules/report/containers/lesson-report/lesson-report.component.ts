import { getProgressList } from '@portal/shared/utils/helper';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { IHttpResponse } from '@portal/core/models';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { ReportService } from '@portal/core/services';
import { takeUntil, finalize } from 'rxjs/operators';
import { LessonOfCourseModalComponent } from '@portal/modules/report/components';

@Component({
  selector: 'lms-lesson-report',
  templateUrl: './lesson-report.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../reports/reports.component.scss',
    './lesson-report.component.scss'
  ]
})
export class LessonReportComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  courses: any[] = [];
  tableFilters = ['title', 'email', 'dealership', 'first_name', 'last_name'];
  cols = [
    {
      field: 'title',
      header: 'Course',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    //{ field: 'email', header: 'Email' },
    {
      field: 'first_name',
      header: 'Name',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    //{ field: 'last_name', header: 'Last Name' },
    {
      field: 'dealership',
      header: 'Dealership',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    //{ field: 'starting_date', header: 'Start Date' },
    //{ field: 'registration_date', header: 'Reg. Date' },
    //{ field: 'expiration_date', header: 'Exp. Date' },
    {
      field: 'status',
      header: 'Status',
      filterType: 'select',
      options: getProgressList(),
      filter: true,
      filterMatchMode: 'contains'
    },
    { field: 'progress', header: 'Progress' },
    { field: 'no_of_lessons', header: 'No. Of Lessons', sortable: true }
  ];
  frozenCols = [{ field: 'title', header: 'Course' }];

  constructor(
    private loadingPlaceholderService: LoadingPlaceholderService,
    private reportService: ReportService,
    private bsModalService: BsModalService
  ) {
    this.loadingPlaceholderService.show();
  }

  ngOnInit() {
    this.fetchAll();
  }

  fetchAll(): void {
    this.reportService
      .getAllUserCourses()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.loadingPlaceholderService.hide())
      )
      .subscribe((response: IHttpResponse) => {
        this.courses = response.status ? response.data : [];
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onShowUserCourses(course: any) {
    const initialState = {
      courseLesson: null,
      course: course
    };
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl'
    };

    this.reportService
      .getLessonProgressByCourse(course.user_course_id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          initialState.courseLesson = response.data;
        }
        this.bsModalService.show(LessonOfCourseModalComponent, {
          initialState,
          ...config
        });
      });
  }
}
