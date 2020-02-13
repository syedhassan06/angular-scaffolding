import { IHttpResponse } from '@portal/core/models';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CourseService } from '@portal/core/services';
import { takeUntil, finalize } from 'rxjs/operators';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';

@Component({
  selector: 'lms-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  courses = [];

  constructor(
    private courseService: CourseService,
    private loadingPlaceholderService: LoadingPlaceholderService
  ) {
    this.loadingPlaceholderService.show();
  }

  ngOnInit() {
    this.fetchAll();
  }

  fetchAll(): void {
    this.courseService
      .getAllLearnerCourses()
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
}
