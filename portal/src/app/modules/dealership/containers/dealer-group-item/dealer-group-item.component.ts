import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, DealershipService } from '@portal/core/services';
import { IHttpResponse, IDealerGroup } from '@portal/core/models';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'lms-dealer-group-item',
  templateUrl: './dealer-group-item.component.html',
  styleUrls: ['./dealer-group-item.component.scss']
})
export class DealerGroupItemComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  dealerGroup: IDealerGroup = null;

  constructor(
    private dealershipService: DealershipService,
    private notifyService: NotificationService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.fetchDealerGroup(routeParams.dealerGroupID);
    });
  }

  fetchDealerGroup(id: number) {
    this.dealershipService
      .getDealerGroupByID(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          this.dealerGroup = response.data;
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  saved(formData: IDealerGroup) {
    this.dealershipService
      .createGroup(formData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            this.notifyService.success(response.message, 'Success');
            this.router.navigateByUrl('dealer/group-manage');
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
