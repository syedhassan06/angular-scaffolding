import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { NotificationService, DealershipService } from '@portal/core/services';
import { IDealer, IHttpResponse } from '@portal/core/models';

@Component({
  selector: 'lms-dealer-manage',
  templateUrl: './dealer-manage.component.html',
  styleUrls: ['./dealer-manage.component.scss']
})
export class DealerManageComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  dealers: IDealer[] = [];

  constructor(
    private loadingPlaceholderService: LoadingPlaceholderService,
    private notifyService: NotificationService,
    private dealershipService: DealershipService
  ) {
    this.loadingPlaceholderService.show();
  }

  ngOnInit() {
    this.fetchAll();
  }

  fetchAll(): void {
    this.dealershipService
      .getAllDealers()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.loadingPlaceholderService.hide())
      )
      .subscribe((response: IHttpResponse) => {
        this.dealers = response.status ? response.data : [];
      });
  }

  deleteDealer(dealer: IDealer) {
    this.dealershipService
      .deleteDealer(dealer.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            const index: number = this.dealers.findIndex(
              (iteratedResource: any) => {
                return iteratedResource.id === dealer.id;
              }
            );
            this.dealers.splice(index, 1);
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

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
