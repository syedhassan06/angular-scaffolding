import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import {
  NotificationService,
  EmailNotificationService
} from '@portal/core/services';
import { IHttpResponse } from '@portal/core/models';

@Component({
  selector: 'lms-email-notifications',
  templateUrl: './email-notifications.component.html',
  styleUrls: ['./email-notifications.component.css']
})
export class EmailNotificationsComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  emailSettings: any[] = [];

  constructor(
    private loadingPlaceholderService: LoadingPlaceholderService,
    private notifyService: NotificationService,
    private emailService: EmailNotificationService
  ) {
    this.loadingPlaceholderService.show();
  }

  ngOnInit() {
    this.fetchAll();
  }

  fetchAll(): void {
    this.emailService
      .getAllSettings()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.loadingPlaceholderService.hide())
      )
      .subscribe((response: IHttpResponse) => {
        this.emailSettings = response.status ? response.data : [];
      });
  }

  deleteEmailSetting(emailSetting: any) {
    this.emailService
      .deleteSetting(emailSetting.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            const index: number = this.emailSettings.findIndex(
              (iteratedResource: any) => {
                return iteratedResource.id === emailSetting.id;
              }
            );
            this.emailSettings.splice(index, 1);
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

  saved(formData: any) {
    this.emailService
      .addSetting(formData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            this.notifyService.success(response.message, 'Success');
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

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
