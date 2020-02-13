import { AppSetting } from './../configs/app-setting.config';
import { Router } from '@angular/router';
import { SessionTimeoutDialogComponent } from './session-timeout-dialog/session-timeout-dialog.component';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  HostListener
} from '@angular/core';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { Observable, Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap';
import { UserIdleService } from 'angular-user-idle';
import { IHttpResponse } from '@portal/core/models';
import {
  AuthService,
  PrincipalService,
  NotificationService
} from '@portal/core/services';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'lms-shell',
  templateUrl: './shell.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class ShellComponent implements OnInit, OnDestroy {
  //displayPlaceholder = false;
  contentLoader$: Observable<any>;
  idleTimeoutDialogRef;
  private destroyed$ = new Subject();

  constructor(
    private loadingPlaceholderService: LoadingPlaceholderService,
    private modalService: BsModalService,
    private userIdle: UserIdleService,
    private router: Router,
    public authService: AuthService,
    private principalService: PrincipalService,
    private notify: NotificationService,
    private $localstorage: LocalStorageService
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {}

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {}

  ngOnInit() {
    this.contentLoader$ = this.loadingPlaceholderService.loaderState$;
    this.logoutSubscriber();
    this.sessionTimeoutSubscriber();
    // this.loadingPlaceholderService.loaderState$.subscribe((res) => {
    //   console.log("res",res);
    //   this.displayPlaceholder = res.show;
    // });
  }

  sessionTimeoutSubscriber() {
    this.userIdle.startWatching();

    // Start watching when user idle is starting.
    this.userIdle
      .onTimerStart()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(count => {
        if (count === 1) {
          this.shownTimeoutPopup();
        }
      });

    // Start watch when time is up.
    this.userIdle
      .onTimeout()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        if (this.idleTimeoutDialogRef) this.idleTimeoutDialogRef.hide();
        this.authService.logoutEmitter();
        this.userIdle.stopTimer();
        this.userIdle.stopWatching();
      });
  }

  shownTimeoutPopup() {
    this.idleTimeoutDialogRef = this.modalService.show(
      SessionTimeoutDialogComponent,
      {
        backdrop: true,
        ignoreBackdropClick: true,
        keyboard: false,
        class: 'session-modal-wrapper',
        initialState: {}
      }
    );
  }

  logoutSubscriber() {
    this.authService.userLogout$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(val => {
        if (val) {
          const guest = this.principalService.hasGuestLogin();
          this.authService
            .logout()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(
              (response: IHttpResponse) => {
                this.notify.success(response.message, 'Logout');
                this.router.navigateByUrl('login');
                if (guest) window.close();
              },
              (err: IHttpResponse) => {
                this.notify.error(
                  (err && err.message) || 'Something went wrong',
                  'Whoops'
                );
              }
            );
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
