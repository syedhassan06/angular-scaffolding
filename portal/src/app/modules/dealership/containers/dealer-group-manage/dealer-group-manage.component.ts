import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IDealerGroup, IHttpResponse } from '@portal/core/models';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { DealershipService, NotificationService } from '@portal/core/services';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'lms-dealer-group-manage',
  templateUrl: './dealer-group-manage.component.html',
  styleUrls: ['./dealer-group-manage.component.scss']
})
export class DealerGroupManageComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  dealerModalSettings = null;
  dealerManagerModalSettings = null;
  dealerGroups: IDealerGroup[] = [];

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
      .getAllGroups()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.loadingPlaceholderService.hide())
      )
      .subscribe((response: IHttpResponse) => {
        this.dealerGroups = response.status ? response.data : [];
      });
  }

  deleteDealerGroup(dealer: IDealerGroup) {
    this.dealershipService
      .deleteDealerGroup(dealer.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            const index: number = this.dealerGroups.findIndex(
              (iteratedResource: any) => {
                return iteratedResource.id === dealer.id;
              }
            );
            this.dealerGroups.splice(index, 1);
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

  onShowDealership(dealergroup: IDealerGroup) {
    const initialState = {
      dealerships: [],
      dealergroup: dealergroup
    };
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-lg'
    };

    this.dealershipService
      .getDealerByDealerGroup(dealergroup.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          initialState.dealerships = response.data;
        }
        this.dealerModalSettings = { initialState, ...config };
      });
  }

  onShownManagerModal(dealergroup: IDealerGroup) {
    const initialState = {
      selectedDealergroup: dealergroup,
      dataSource: []
    };
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-lg'
    };

    this.dealershipService
      .getDealergroupManagers(dealergroup.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          initialState.dataSource = response.data;
        }
        this.dealerManagerModalSettings = { initialState, ...config };
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
