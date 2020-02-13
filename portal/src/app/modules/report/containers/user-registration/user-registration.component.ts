import { getRoleList } from '@portal/shared/utils/helper';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IHttpResponse } from '@portal/core/models';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { ReportService } from '@portal/core/services';
import { takeUntil, finalize } from 'rxjs/operators';
import { Table } from 'primeng/table';

@Component({
  selector: 'lms-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: [
    '../reports/reports.component.scss',
    'user-registration.component.scss'
  ]
})
export class UserRegistrationComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  users: any[] = [];
  tableFilters = ['email', 'first_name', 'last_name'];
  cols = [
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
      field: 'email',
      header: 'Email',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'roles',
      header: 'Roles',
      filterType: 'select',
      options: getRoleList(),
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'name',
      header: 'Dealership',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'created_at',
      header: 'Reg. Date',
      filter: true,
      filterType: 'date',
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
      .getUserRegistrationHistory()
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
