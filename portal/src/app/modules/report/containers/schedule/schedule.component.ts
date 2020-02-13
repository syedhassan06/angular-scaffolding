import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import {
  NotificationService,
  EmailNotificationService,
  ReportService,
  DealershipService
} from '@portal/core/services';
import { IHttpResponse, IDealershipLearner } from '@portal/core/models';

@Component({
  selector: 'lms-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  reportData: any[] = [];
  managers = [];
  dealershipedLearners: IDealershipLearner[] = [];
  constructor(
    private loadingPlaceholderService: LoadingPlaceholderService,
    private notifyService: NotificationService,
    private reportService: ReportService,
    private dealershipService: DealershipService,
    private route: ActivatedRoute
  ) {
    this.loadingPlaceholderService.show();
  }

  ngOnInit() {
    this.fetchAll();
    this.fetchAllManagers();
    this.fetchAllDealershipLearners();
    this.reportService.saveSchedule$.subscribe(val => {
      if (val) {
        this.fetchAll();
      }
    });
  }

  fetchAll(): void {
    this.reportService
      .getScheduleReport()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.loadingPlaceholderService.hide())
      )
      .subscribe((response: IHttpResponse) => {
        this.reportData = response.status ? response.data : [];
      });
  }

  deleteEmailSetting(schedule: any) {
    this.reportService
      .deleteSchedule(schedule.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            const index: number = this.reportData.findIndex(
              (iteratedResource: any) => {
                return iteratedResource.id === schedule.id;
              }
            );
            this.reportData.splice(index, 1);
            this.notifyService.success(response.message, 'Success');
          } else {
            this.notifyService.error(response.message, 'Error');
          }
        },
        (errResponse: IHttpResponse) => {
          this.notifyService.error(
            (errResponse && errResponse.message) || 'Something went wrong',
            'Error'
          );
        }
      );
  }

  fetchAllManagers() {
    this.reportService
      .getAllManagers()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        this.managers = response.status ? response.data : [];
      });
  }

  fetchAllDealershipLearners() {
    this.dealershipService
      .getDealershipWithLearners()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        this.dealershipedLearners = response.status ? response.data : [];
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
