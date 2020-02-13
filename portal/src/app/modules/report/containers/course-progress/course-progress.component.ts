import { ConfirmationService } from '@portal/shared/components/confirm-dialog/confirm-dialog.service';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { IHttpResponse, ICourseStats } from '@portal/core/models';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { ReportService, NotificationService } from '@portal/core/services';
import { takeUntil, finalize } from 'rxjs/operators';
import { getProgressList } from '@portal/shared/utils/helper';

@Component({
  selector: 'lms-course-progress',
  templateUrl: './course-progress.component.html',
  styleUrls: [
    '../reports/reports.component.scss',
    './course-progress.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class CourseProgressComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  courses: any[] = [];
  selectedCourse: ICourseStats = null;
  tableFilters = ['title', 'email'];
  cols = [
    {
      field: 'title',
      header: 'Course',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'email',
      header: 'Email',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'name',
      header: 'Name',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'dealership',
      header: 'Dealership',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'status',
      header: 'Status',
      filterType: 'select',
      filter: true,
      filterMatchMode: 'contains',
      options: getProgressList()
    },
    { field: 'progress', header: 'Progress' },
    {
      field: 'registration_date',
      header: 'Reg. Date',
      filterType: 'date',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'starting_date',
      header: 'Start Date',
      filterType: 'date',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'expiration_date',
      header: 'Exp. Date',
      filterType: 'date',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      header: 'Action'
    }
  ];

  constructor(
    private loadingPlaceholderService: LoadingPlaceholderService,
    private confirmService: ConfirmationService,
    private reportService: ReportService,
    private notifyService: NotificationService
  ) {
    this.loadingPlaceholderService.show();
  }

  ngOnInit() {
    this.fetchAll();
  }

  fetchAll(): void {
    this.reportService
      .getAllCourseProgress()
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

  markedToCompleteCourse() {
    //console.log(this.selectedCourse);
    this.reportService
      .completeMarkedOnCourse({
        user_course_id: this.selectedCourse.user_course_id,
        course_id: this.selectedCourse.course_id
      })
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            const foundIndex = this.courses.findIndex(
              item =>
                item.course_id === this.selectedCourse.course_id &&
                this.selectedCourse.user_course_id === item.user_course_id
            );
            if (foundIndex !== -1) {
              this.courses.splice(foundIndex, 1);
            }
            this.notifyService.success(response.message, 'Success');
          } else {
            this.notifyService.error(response.message, 'Error');
          }
        },
        (errResponse: IHttpResponse) => {
          this.notifyService.error(
            (errResponse && errResponse.message) || 'Something went wrong',
            'Error'
          );
        }
      );
  }

  onCompleteCourse(course: ICourseStats): void {
    this.selectedCourse = course;
    this.confirmService.confirm(
      {
        title: 'Course Completion',
        content: 'Are you sure you want to mark the course as completed?',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes'
      },
      () => {
        this.markedToCompleteCourse();
      },
      () => {}
    );
  }
}
