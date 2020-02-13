import { Subject } from 'rxjs/Subject';
import { Component, OnInit } from '@angular/core';
import { IUser, IHttpResponse } from '@portal/core/models';
import { NotificationService, UserService } from '@portal/core/services';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'lms-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private readonly destroyed$ = new Subject<void>();
  users: IUser[] = [];

  constructor(
    private loadingPlaceholderService: LoadingPlaceholderService,
    private notifyService: NotificationService,
    private userService: UserService
  ) {
    this.loadingPlaceholderService.show();
  }

  ngOnInit() {
    this.fetchAll();
  }

  fetchAll(): void {
    this.userService
      .getAllUsers()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.loadingPlaceholderService.hide())
      )
      .subscribe((response: IHttpResponse) => {
        this.users = response.status ? response.data : [];
      });
  }

  deleteUser(user: IUser) {
    this.userService
      .deleteUser(user.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            const index: number = this.users.findIndex(
              (iteratedResource: any) => {
                return iteratedResource.id === user.id;
              }
            );
            this.users.splice(index, 1);
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

  savedStatus(user: IUser) {
    const formData = { id: user.id, is_active: user.is_active };
    this.userService
      .updateStatus(formData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response && response.status) {
            this.notifyService.success(response.message, 'Success');
          } else {
            this.notifyService.error(response.message, 'Error');
          }
        },
        (err: IHttpResponse) => {
          user.is_active = false;
          this.notifyService.error(
            (err && err.message) || 'Something went wrong',
            'Error'
          );
        }
      );
  }

  sendEmail(user: IUser) {
    const formData = { id: user.id, email: user.email };
    this.userService
      .sendCredentials(formData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response && response.status) {
            this.notifyService.success(response.message, 'Success');
          } else {
            this.notifyService.error(response.message, 'Error');
          }
        },
        (err: IHttpResponse) => {
          user.is_active = false;
          this.notifyService.error(
            (err && err.message) || 'Something went wrong',
            'Error'
          );
        }
      );
  }
}
