import { AuthService } from '@portal/core/services';
import { BsModalRef } from 'ngx-bootstrap';
import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { Subject, of, timer } from 'rxjs';
import { AppSetting } from '@portal/configs/app-setting.config';
import { UserIdleService } from 'angular-user-idle';

@Component({
  selector: 'lms-session-timeout-dialog',
  templateUrl: './session-timeout-dialog.component.html',
  styleUrls: ['./session-timeout-dialog.component.scss']
})
export class SessionTimeoutDialogComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();
  timeout = AppSetting.sessionTimeout;

  constructor(
    public modalRef: BsModalRef,
    public authService: AuthService,
    private userIdle: UserIdleService
  ) {}

  ngOnInit() {}

  onCancel(): void {
    this.userIdle.stopTimer();
    //this.userIdle.startWatching();
    this.modalRef.hide();
  }

  onConfirm(): void {
    this.authService.logoutEmitter();
    this.modalRef.hide();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
