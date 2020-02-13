import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CourseService } from '@portal/core/services/course.service';
import { ICourseItem } from '@portal/core/models';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'lms-course-dashboard',
  templateUrl: './course-dashboard.component.html',
  styleUrls: ['./course-dashboard.component.scss']
})
export class CourseDashboardComponent implements OnInit, OnDestroy {
  course: ICourseItem;
  private readonly destroyed$ = new Subject<void>();

  constructor(private courseService: CourseService) {
    this.courseService.coursePageType = 'dashboard';
  }

  ngOnInit() {
    this.courseService.coursePageType = 'dashboard';
    this.fetchCourse();
  }

  fetchCourse() {
    this.courseService.courseItem$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((course: ICourseItem) => {
        this.course = course;
      });
  }

  ngOnDestroy() {
    this.courseService.coursePageType = 'other';
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
