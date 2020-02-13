import { BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IHttpResponse } from '@portal/core/models';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { ReportService } from '@portal/core/services';
import { takeUntil, finalize } from 'rxjs/operators';
import { UserCourseModalComponent } from '@portal/modules/report/components';

@Component({
  selector: 'lms-dealership-report',
  templateUrl: './dealership-report.component.html',
  styleUrls: ['../reports/reports.component.scss']
})
export class DealershipReportComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  users: any[] = [];
  tableFilters = ['email', 'name', 'first_name', 'last_name'];
  cols = [
    {
      field: 'name',
      header: 'Dealership',
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
    { field: 'courses', header: 'No. Of Courses' }
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
      .getAllDealerships()
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

  onShowUserCourses(user: any) {
    const initialState = {
      userCourse: null,
      user: user
    };
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-lg'
    };

    this.reportService
      .getUserCourse(user.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          initialState.userCourse = response.data;
        }
        this.bsModalService.show(UserCourseModalComponent, {
          initialState,
          ...config
        });
      });
  }
}
