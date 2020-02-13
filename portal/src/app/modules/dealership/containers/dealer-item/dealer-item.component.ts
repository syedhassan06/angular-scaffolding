import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DealershipService } from '@portal/core/services/dealership.service';
import { NotificationService } from '@portal/core/services';
import { IHttpResponse, IDealerGroup, IDealer } from '@portal/core/models';

@Component({
  selector: 'lms-dealer-item',
  templateUrl: './dealer-item.component.html',
  styleUrls: ['./dealer-item.component.scss']
})
export class DealerItemComponent implements OnInit, OnDestroy {
  dealerGroups: IDealerGroup[] = [];
  dealer: IDealer = null;
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private dealershipService: DealershipService,
    private notifyService: NotificationService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.fetchAllDealerGroups();
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.fetchDealer(routeParams.dealerID);
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  fetchAllDealerGroups() {
    this.dealershipService
      .getAllGroups()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          this.dealerGroups = response.data;
        }
      });
  }

  fetchDealer(id: number) {
    this.dealershipService
      .getDealerByID(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          this.dealer = response.data;
        }
      });
  }

  saved(formData: IDealer) {
    this.dealershipService
      .create(formData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            this.notifyService.success(response.message, 'Success');
            this.router.navigateByUrl('dealer/manage');
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
