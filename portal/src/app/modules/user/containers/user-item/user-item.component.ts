import { IDealer } from '@portal/core/models/dealership.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  NotificationService,
  UserService,
  DealershipService
} from '@portal/core/services';
import { IUserForm, IHttpResponse, IUser } from '@portal/core/models';

@Component({
  selector: 'lms-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit, OnDestroy {
  user: IUser = null;
  dealerships: IDealer[] = [];
  private readonly destroyed$ = new Subject<void>();
  constructor(
    private activeRoute: ActivatedRoute,
    private notifyService: NotificationService,
    private userService: UserService,
    private dealershipService: DealershipService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchAllDealerships();
    this.activeRoute.params.subscribe(routeParams => {
      if (routeParams.id) {
        this.fetchUser(routeParams.id);
      }
    });
  }

  savedUser(formData: IUserForm) {
    this.userService
      .createUser(formData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            this.notifyService.success(response.message, 'Success');
            this.router.navigateByUrl('user/manage');
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

  fetchUser(id: number) {
    this.userService
      .getUserByID(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          this.user = response.data;
        }
      });
  }

  fetchAllDealerships() {
    this.dealershipService
      .getAllDealers()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          this.dealerships = response.data;
        }
      });
  }
}
