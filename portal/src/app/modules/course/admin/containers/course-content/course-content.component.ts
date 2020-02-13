import { Subject, of } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NotificationService, CourseService } from '@portal/core/services';
import { ConfirmationService } from '@portal/shared/components/confirm-dialog/confirm-dialog.service';
import { takeUntil, switchMap, finalize } from 'rxjs/operators';
import {
  IHttpResponse,
  ICourseItem,
  ICourseLesson,
  ICourseAvailableLesson,
  ICourseAssignedLesson
} from '@portal/core/models';
import { NgxSpinnerService } from 'ngx-spinner';
import { LessonContentModalComponent } from '@portal/shared/components/lesson-content-modal/lesson-content-modal.component';
import { AssignmentModalComponent } from './../../components/assignment-modal/assignment-modal.component';

@Component({
  selector: 'lms-course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.scss']
})
export class CourseContentComponent implements OnInit, OnDestroy {
  @ViewChild('template') modalTemplate;
  modalRef: BsModalRef;
  deletedCourseLesson: ICourseAssignedLesson;
  courseLessonForm = {
    lesson_id: 0,
    lesson_type: 'required',
    course_id: 0
  };
  private readonly destroyed$ = new Subject<void>();
  courseLesson: ICourseLesson = {
    availableLessons: [],
    assignedLessons: []
  };
  requiredLessons: ICourseAssignedLesson[] = [];
  optionalLessons: ICourseAssignedLesson[] = [];
  assignments = [{ id: 1, name: 'Assignment-01' }];

  constructor(
    private modalService: BsModalService,
    private courseService: CourseService,
    private spinner: NgxSpinnerService,
    private confirmService: ConfirmationService,
    private notifyService: NotificationService
  ) {}

  ngOnInit() {
    this.fetchCourseContent();

    this.modalService.onShown.subscribe(result => {
      this.courseLessonForm.lesson_id = 0;
      this.courseLessonForm.lesson_type = 'required';
      //console.log("result",result);
    });
  }

  onOpenModal() {
    this.modalRef = this.modalService.show(this.modalTemplate, {
      class: 'modal-lg course-lesson-modal',
      ignoreBackdropClick: true
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onAddLesson() {
    this.spinner.show();
    const data: { lesson_id: number; lesson_type: string } = {
      ...this.courseLessonForm
    };
    this.courseService
      .addLessonOnCourse(data)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.spinner.hide();
          this.modalRef.hide();
        })
      )
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            this.fetchCourseContent();
            this.notifyService.success(response.message, 'Success');
            if (
              typeof response.data.lesson_type === 'string' &&
              response.data.lesson_type.toLowerCase() === 'required'
            ) {
              this.requiredLessons.push(response.data);
            } else if (
              typeof response.data.lesson_type === 'string' &&
              response.data.lesson_type.toLowerCase() === 'optional'
            ) {
              this.optionalLessons.push(response.data);
            }
            //this.router.navigateByUrl('course/manage-list');
          } else {
            this.notifyService.error(response.message, 'Error');
          }
        },
        (err: IHttpResponse) => {
          this.notifyService.error(
            (err && err.message) || 'Something went wrong',
            'Error'
          );
        }
      );
  }

  onOpenConfirmModal(courseLesson: ICourseAssignedLesson): void {
    this.deletedCourseLesson = courseLesson as ICourseAssignedLesson;
    this.confirmService.confirm(
      {
        title: 'Confirmation',
        content: 'Are you sure you want to delete',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes'
      },
      () => {
        this.deleteCourseLesson();
      },
      () => {}
    );
  }

  deleteCourseLesson(): void {
    this.courseService
      .deleteLessonOnCourse(this.deletedCourseLesson.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            let courseLessons = [];
            if (
              typeof this.deletedCourseLesson.lesson_type === 'string' &&
              this.deletedCourseLesson.lesson_type.toLowerCase() === 'required'
            ) {
              courseLessons = this.requiredLessons;
            } else if (
              typeof this.deletedCourseLesson.lesson_type === 'string' &&
              this.deletedCourseLesson.lesson_type.toLowerCase() === 'optional'
            ) {
              courseLessons = this.optionalLessons;
            }
            const index: number = courseLessons.findIndex(
              (iteratedResource: any) => {
                return iteratedResource.id === this.deletedCourseLesson.id;
              }
            );
            courseLessons.splice(index, 1);
            this.fetchCourseContent();
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

  fetchCourseContent() {
    this.courseService.courseItem$
      .pipe(
        switchMap((course: ICourseItem) => {
          if (course && course.id) {
            this.courseLessonForm.course_id = course.id;
            return this.courseService.getCourseLessons(course.id);
          } else {
            return of({ status: false, data: null });
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((res: IHttpResponse) => {
        if (res.status) {
          this.courseLesson = { ...this.courseLesson, ...res.data };
          if (Array.isArray(this.courseLesson.assignedLessons)) {
            this.requiredLessons = this.courseLesson.assignedLessons.filter(
              (item: ICourseAssignedLesson) =>
                typeof item.lesson_type === 'string' &&
                item.lesson_type.toLowerCase() === 'required'
            );
            this.requiredLessons = this.requiredLessons.sort(function(a, b) {
              return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
            });
            this.optionalLessons = this.courseLesson.assignedLessons.filter(
              (item: ICourseAssignedLesson) =>
                typeof item.lesson_type === 'string' &&
                item.lesson_type.toLowerCase() === 'optional'
            );
            this.optionalLessons = this.optionalLessons.sort(function(a, b) {
              return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
            });
          }
        }
      });
  }

  shownLessonContent(resource) {
    const initialState = {
      selectedResource: resource
    };
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl'
    };
    this.modalService.show(LessonContentModalComponent, {
      initialState,
      ...config
    });
  }
}
