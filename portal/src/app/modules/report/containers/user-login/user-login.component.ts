import { BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IHttpResponse } from '@portal/core/models';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { ReportService } from '@portal/core/services';
import { takeUntil, finalize } from 'rxjs/operators';
import { LoginHistoryModalComponent } from '@portal/modules/report/components';

@Component({
  selector: 'lms-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['../reports/reports.component.scss']
})
export class UserLoginComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  users: any[] = [];
  tableFilters = ['email', 'name', 'first_name', 'last_name'];
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
      field: 'name',
      header: 'Dealership',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    { field: 'no_of_logins', header: 'No. Of Logins' }
  ];

  constructor(
    private loadingPlaceholderService: LoadingPlaceholderService,
    private reportService: ReportService,
    private bsModalService: BsModalService
  ) {
    this.loadingPlaceholderService.show();
  }

  ngOnInit() {
    this.fetchAll();
  }

  fetchAll(): void {
    this.reportService
      .getUserLoginHistory()
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

  onShowUserLoginHistory(user: any) {
    const initialState = {
      user: null
    };
    const config = {
      backdrop: true,
      ignoreBackdropClick: true
    };

    this.reportService
      .getUserLoginHistoryByID(user.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          initialState.user = response.data;
        }
        this.bsModalService.show(LoginHistoryModalComponent, {
          initialState,
          ...config
        });
      });
  }
}
