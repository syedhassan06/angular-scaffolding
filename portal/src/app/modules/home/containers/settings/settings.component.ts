import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, SettingsService } from '@portal/core/services';
import { IHttpResponse } from '@portal/core/models';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'lms-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  settings: any = null;

  constructor(
    private settingsService: SettingsService,
    private notifyService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchSettings(1);
  }

  fetchSettings(id: number) {
    this.settingsService
      .getSettings()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          this.settings = response.data;
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  saved(formData: any) {
    this.settingsService
      .updateSettings(formData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            this.notifyService.success(response.message, 'Success');
            this.router.navigateByUrl('admin-dashboard');
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
