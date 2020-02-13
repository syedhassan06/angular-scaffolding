import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  NotificationService,
  EmailNotificationService
} from '@portal/core/services';
import { IHttpResponse } from '@portal/core/models';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'lms-email-notification-item',
  templateUrl: './email-notification-item.component.html',
  styleUrls: ['./email-notification-item.component.css']
})
export class EmailNotificationItemComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  emailSetting: any = null;

  constructor(
    private emailService: EmailNotificationService,
    private notifyService: NotificationService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      if (routeParams.id) this.fetchEmailSetting(routeParams.id);
    });
  }

  fetchEmailSetting(id: number) {
    this.emailService
      .getSettingByID(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          this.emailSetting = response.data;
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  saved(formData: any) {
    this.emailService
      .addSetting(formData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            this.notifyService.success(response.message, 'Success');
            this.router.navigateByUrl('email-setting');
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
}
