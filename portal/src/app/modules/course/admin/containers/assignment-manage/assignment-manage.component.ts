import { Observable } from 'rxjs/Observable';
import { AssignmentModalComponent } from './../../components/assignment-modal/assignment-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil, finalize, delay, switchMap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import {
  NotificationService,
  EmailNotificationService,
  ReportService,
  CourseService,
  MaterialService
} from '@portal/core/services';
import { IHttpResponse, ICourseItem, IAssignment } from '@portal/core/models';

@Component({
  selector: 'lms-assignment-manage',
  templateUrl: './assignment-manage.component.html',
  styleUrls: ['./assignment-manage.component.scss']
})
export class AssignmentManageComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  reportData: any[] = [];
  managers = [];
  assignments: IAssignment[] = [];
  selectedCourse: ICourseItem = null;
  dataSource = {
    resources: [],
    submittedAssignments: []
  };
  assignmentModalRef: BsModalRef;

  constructor(
    private loadingPlaceholderService: LoadingPlaceholderService,
    private notifyService: NotificationService,
    private materialService: MaterialService,
    private modalService: BsModalService,
    private courseService: CourseService
  ) {
    //this.loadingPlaceholderService.show();
  }

  ngOnInit() {
    this.fetchCourseContent();
    this.fetchAllMaterials();
  }

  deleteEmailSetting(schedule: any) {
    this.courseService
      .deleteAssignmentFromCourse(schedule.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            const index: number = this.reportData.findIndex(
              (iteratedResource: any) => {
                return iteratedResource.id === schedule.id;
              }
            );
            this.reportData.splice(index, 1);
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

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  fetchCourseContent() {
    this.courseService.courseItem$
      .pipe(
        switchMap((course: ICourseItem) => {
          if (course && course.id) {
            this.selectedCourse = course;
            this.fetchAllSubmittedAssignmnents();
            return this.courseService.fetchAllAssignments(course.id);
          } else {
            return of({ status: false, data: null });
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((res: IHttpResponse) => {
        if (res.status) {
          this.assignments = res.data;
        }
      });
  }

  fetchAllMaterials(): void {
    this.materialService
      .getAllMaterials()
      .pipe(
        takeUntil(this.destroyed$),
        delay(5000)
      )
      .subscribe(res => {
        if (res.status) {
          if (this.assignmentModalRef) {
            this.assignmentModalRef.content.resources = res.data;
            this.assignmentModalRef.content.populateResource();
          }
          this.dataSource.resources = res.data;
        }
      });
  }

  onShownAssignment(assignment: IAssignment = null) {
    const initialState = {
      assignments: this.assignments,
      selectedAssignment: assignment,
      resources: this.dataSource.resources,
      selectedCourseID: this.selectedCourse.id
    };
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-lg'
    };
    this.assignmentModalRef = this.modalService.show(AssignmentModalComponent, {
      initialState,
      ...config
    });
  }

  onClickSelectedAssignment(assignment: IAssignment) {
    this.fetchAssignment(assignment);
  }

  fetchAssignment(assignment) {
    this.courseService
      .fetchAssignment(this.selectedCourse.id, assignment.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        if (res.status) {
          this.onShownAssignment(assignment);
        }
      });
  }

  fetchAllSubmittedAssignmnents() {
    this.courseService
      .fetchSubmittedAssignment(this.selectedCourse.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        if (res.status) {
          this.dataSource.submittedAssignments = res.data;
        }
      });
  }

  onDeleteAssignment(assignment) {
    this.courseService
      .deleteAssignmentFromCourse(assignment.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        res => {
          if (res.status) {
            const index: number = this.assignments.findIndex((item: any) => {
              return item.id === assignment.id;
            });
            this.assignments.splice(index, 1);
            this.notifyService.success(res.message, 'Success');
          } else {
            this.notifyService.success(res.message, 'Error');
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
}
