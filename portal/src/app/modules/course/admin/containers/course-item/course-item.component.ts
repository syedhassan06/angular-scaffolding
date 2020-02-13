import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CourseService } from '@portal/core/services/course.service';
import { NotificationService } from '@portal/core/services';
import { ICourseItem, IHttpResponse, ICourseForm } from '@portal/core/models';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'lms-course-item',
  templateUrl: './course-item.component.html',
  styleUrls: ['./course-item.component.scss']
})
export class CourseItemComponent implements OnInit, OnDestroy {
  course: ICourseItem;
  private readonly destroyed$ = new Subject<void>();
  constructor(
    private activeRoute: ActivatedRoute,
    private notifyService: NotificationService,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.fetchCourse(routeParams.courseID);
    });
  }

  saved(payload: ICourseForm) {
    this.courseService
      .create(payload)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            this.notifyService.success(response.message, 'Success');
            this.router.navigateByUrl('course/manage-list');
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

  fetchCourse(id: number) {
    this.courseService
      .getCourseByID(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          this.course = response.data;
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
