import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportService } from '@portal/core/services';
import { takeUntil, finalize } from 'rxjs/operators';
import { IHttpResponse } from '@portal/core/models';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';

@Component({
  selector: 'lms-activity-report',
  templateUrl: './activity-report.component.html',
  styleUrls: [
    '../reports/reports.component.scss',
    './activity-report.component.scss'
  ]
})
export class ActivityReportComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  users: any[] = [];
  tableFilters = ['name', 'email', 'activity'];
  cols = [
    {
      field: 'name',
      header: 'Name',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains',
      sortable: true
    },
    {
      field: 'email',
      header: 'Email',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains',
      sortable: true
    },
    {
      field: 'activity',
      header: 'Activity'
    },
    {
      field: 'date_time',
      header: 'Date',
      filterType: 'date',
      filter: true,
      filterMatchMode: 'contains',
      sortable: true
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
      .getActivityLog()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.loadingPlaceholderService.hide())
      )
      .subscribe((response: IHttpResponse) => {
        this.users = response.status ? response.data : [];
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
