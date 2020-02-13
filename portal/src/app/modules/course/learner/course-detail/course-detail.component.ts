import { Subject } from 'rxjs/Subject';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IHttpResponse } from '@portal/core/models';
import { CourseService, NotificationService } from '@portal/core/services';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { finalize, takeUntil, switchMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'lms-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  @ViewChild('template') modalTemplate;
  modalRef: BsModalRef;
  course: any = null;
  isCourseAccomplished = false;
  courseResourceUrl = '';
  selectedCourseID: number;
  selectedCourseLesson;
  lessons = { required: [], optional: [] };
  private readonly destroyed$ = new Subject<void>();
  allAssignments = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private courseService: CourseService,
    private notifyService: NotificationService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private loadingPlaceholderService: LoadingPlaceholderService,
    private spinner: NgxSpinnerService
  ) {
    this.loadingPlaceholderService.show();
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.selectedCourseID = routeParams.courseID;
      this.fetchCourseLessons(routeParams.courseID);
    });
    this.onCloseLessonSubsciber();
  }

  fetchCourseLessons(courseID) {
    return this.courseService
      .getAllLearnerLessonsByCourse(courseID)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.loadingPlaceholderService.hide();
          this.spinner.hide();
        })
      )
      .subscribe(
        (response: IHttpResponse) => {
          this.shownCourseDetail(response);
          if (response && response.status) {
            this.allAssignments = response.data.assignment;
          }
        },
        err => this.spinner.hide(),
        () => this.spinner.hide()
      );
  }

  shownCourseDetail(response: IHttpResponse) {
    this.course = response.status ? response.data : null;
    this.lessons.optional = this.course.lessons.filter(
      item => item.lesson_type === 'optional'
    );
    this.lessons.required = this.course.lessons.filter(
      item => item.lesson_type === 'required'
    );
  }

  onClickLesson(lesson: any) {
    this.selectedCourseLesson = lesson;
    //console.log(document.getElementById("course-frame"));
    this.courseService
      .launchedCourse(lesson.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          const data = response.data;
          //window.open(data.resource,'_blank');
          this.courseResourceUrl = <any>(
            this.sanitizer.bypassSecurityTrustResourceUrl(
              '/secure-files/' +
                data.resource +
                ((new RegExp('.pdf$').test(data.resource) && '#toolbar=0') ||
                  '')
            )
          );
          this.onClickModal();
          //lesson.status="Completed";
          if (data.progress) {
            this.course.progress = data.progress;
          }
          //this.notifyService.success(response.message,"Success");
        }
      });
  }

  onClickCompleteCourse() {
    this.courseService
      .courseAccomplishment({ user_course_id: this.course.user_course_id })
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          this.course.status = 'Completed';
          this.course.progress = 100;
          this.notifyService.success(response.message, 'Success');
        }
      });
  }
  onClickModal() {
    this.modalRef = this.modalService.show(this.modalTemplate, {
      class: 'modal-xl course-lesson-modal',
      ignoreBackdropClick: true
    });
    document.getElementById('course-frame').oncontextmenu = function() {
      return false;
    };
  }
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  haveDisabled(
    lessonType: string,
    currentIndex: number,
    previousIndex: number
  ) {
    if (this.lessons[lessonType] && Array.isArray(this.lessons[lessonType])) {
      if (currentIndex === 0) {
        //console.log("first Element")
      } else if (this.lessons[lessonType][currentIndex]) {
        if (
          this.lessons[lessonType][previousIndex] &&
          this.lessons[lessonType][previousIndex]['status'].toLowerCase() !==
            'completed'
        ) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  onCloseLessonSubsciber() {
    this.modalService.onHidden
      .pipe(takeUntil(this.destroyed$))
      .subscribe(result => {
        this.courseService
          .courseActivityLog(this.selectedCourseLesson.id)
          .subscribe(
            (response: IHttpResponse) => {
              if (response.status)
                this.fetchCourseLessons(this.selectedCourseID);
              this.spinner.hide();
            },
            err => this.spinner.hide(),
            () => this.spinner.hide()
          );
      });
  }

  disableContextMenu() {
    console.log('ASDads');
    const element: HTMLIFrameElement = document.getElementById(
      'course-frame'
    ) as HTMLIFrameElement;
    const iframe = element.contentWindow;
    if (iframe) iframe.document.oncontextmenu = () => false;
  }

  test(event) {
    console.log('event', event);
  }
}
