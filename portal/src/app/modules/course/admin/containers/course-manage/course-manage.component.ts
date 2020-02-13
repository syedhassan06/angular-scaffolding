import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { IHttpResponse, ICourseItem } from '@portal/core/models';
import { CourseService, NotificationService } from '@portal/core/services';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { ConfirmationService } from '@portal/shared/components/confirm-dialog/confirm-dialog.service';
import { getStatusList } from '@portal/shared/utils/helper';

@Component({
  selector: 'lms-course-manage',
  templateUrl: './course-manage.component.html',
  styleUrls: ['./course-manage.component.scss']
})
export class CourseManageComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  courses: ICourseItem[] = [];
  bsModalRef: BsModalRef;
  selectedCourse: ICourseItem = null;
  tableFilters = ['title'];
  cols = [
    {
      field: 'title',
      header: 'Title',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'isActive',
      header: 'Status',
      filterType: 'select',
      filter: true,
      options: getStatusList(),
      filterMatchMode: 'contains'
    },
    {
      field: 'createdDate',
      header: 'Date Created',
      filterType: 'date',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      header: 'Action'
    }
  ];

  constructor(
    private courseService: CourseService,
    private loadingPlaceholderService: LoadingPlaceholderService,
    private confirmService: ConfirmationService,
    private notifyService: NotificationService
  ) {
    this.loadingPlaceholderService.show();
  }

  ngOnInit() {
    this.fetchAll();
  }

  fetchAll(): void {
    this.courseService
      .getCourses()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.loadingPlaceholderService.hide())
      )
      .subscribe((response: IHttpResponse) => {
        this.courses = response.status ? response.data : [];
      });
  }

  deleteMaterial(): void {
    this.courseService
      .deleteCourse(this.selectedCourse.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            const index: number = this.courses.findIndex(
              (iteratedResource: any) => {
                return iteratedResource.id === this.selectedCourse.id;
              }
            );
            this.courses.splice(index, 1);
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

  onOpenConfirmModal(course: ICourseItem): void {
    this.selectedCourse = course;
    console.log('this.selectedCourse,this.selectedCourse', this.selectedCourse);
    this.confirmService.confirm(
      {
        title: 'Confirmation',
        content: 'Are you sure you want to delete',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes'
      },
      () => {
        this.deleteMaterial();
      },
      () => {}
    );
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
