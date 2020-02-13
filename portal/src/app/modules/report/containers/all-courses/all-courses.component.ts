import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IHttpResponse } from '@portal/core/models';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { ReportService } from '@portal/core/services';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'lms-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['../reports/reports.component.scss']
})
export class AllCoursesComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  courses: any[] = [];
  tableFilters = ['title'];
  cols = [
    {
      field: 'title',
      header: 'Course',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    { field: 'users', header: 'No. Of Learners' },
    { field: 'dealerships', header: 'No. Of Dealerships' }
  ];

  constructor(
    private loadingPlaceholderService: LoadingPlaceholderService,
    private reportService: ReportService
  ) {
    this.loadingPlaceholderService.show();
  }

  ngOnInit() {
    this.fetchAll();
  }

  fetchAll(): void {
    this.reportService
      .getAllCourses()
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
