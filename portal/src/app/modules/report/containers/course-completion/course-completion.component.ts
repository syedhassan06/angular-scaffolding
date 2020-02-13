import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { IHttpResponse } from '@portal/core/models';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { ReportService } from '@portal/core/services';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'lms-course-completion',
  templateUrl: './course-completion.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./course-completion.component.scss']
})
export class CourseCompletionComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  courses: any[] = [];
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
      field: 'first_name',
      header: 'First Name',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'last_name',
      header: 'Last Name',
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
      header: 'Completion Date',
      filterType: 'date',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'completed_by',
      header: 'Completed By',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    }
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
      .getAllCourseCompletion()
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
