import { Subject } from 'rxjs/Subject';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { takeUntil, finalize } from 'rxjs/operators';
import {
  IHttpResponse,
  IAssociate,
  IDealer,
  IAssociateLearner
} from '@portal/core/models';
import { DealershipService, NotificationService } from '@portal/core/services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'lms-associate-manager',
  templateUrl: './associate-manager.component.html',
  styleUrls: ['./associate-manager.component.scss']
})
export class AssociateManagerComponent implements OnInit, OnDestroy {
  @ViewChild('dealerModalTemplate') dealerModalTemplate;
  @Input()
  set selectedDealer(data: IDealer) {
    if (data) {
      this._dealer = data;
      this.fetchAvailableManagers(data);
    }
  }
  get selectedDealer(): IDealer {
    return this._dealer;
  }
  dealerModalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  };
  actionType = {
    manager: {
      title: 'Associate Dealerships to Managers'
    },
    learner: {
      title: 'Associate Dealerships to User'
    }
  };

  managers: IAssociateLearner = {
    assignedUsers: [],
    availableUsers: []
  };
  private _dealer: IDealer;
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private dealershipService: DealershipService,
    private notifyService: NotificationService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {}

  show() {
    this.dealerModalRef = this.modalService.show(
      this.dealerModalTemplate,
      this.config
    );
  }

  hide() {
    this.dealerModalRef.hide();
  }

  fetchAvailableManagers(dealer: IDealer) {
    this.dealershipService
      .getAssociateManagers(dealer.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res: IHttpResponse) => {
        if (res.status) {
          this.managers = { ...this.managers, ...res.data };
        }
      });
  }

  onManagerAssigned(event) {
    const users: IAssociate[] = event.items;
    const userIDs: any[] = users.map((item: IAssociate) => item.id);
    const data = { user_id: userIDs, dealership_id: this.selectedDealer.id };
    this.spinner.show();
    this.dealershipService
      .addManager(data)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            this.notifyService.success(response.message, 'Success');
            //this.router.navigateByUrl('course/manage-list');
          } else {
            //this.removeFromUserList('assignedUsers',users);
            //this.updateUserList('availableUsers',users);
            //this.notifyService.error(response.message,'Error');
          }
        },
        (err: IHttpResponse) => {
          //this.removeFromUserList('assignedUsers',users);
          //this.updateUserList('availableUsers',users);
          //this.notifyService.error(err && err.message || 'Something went wrong','Error');
        }
      );
  }

  onManagerUnAssigned(event) {
    const users: IAssociate[] = event.items;
    const userIDs: any[] = users.map((item: IAssociate) => item.id);
    const data = { user_id: userIDs, dealership_id: this.selectedDealer.id };
    this.spinner.show();
    this.dealershipService
      .removeManager(data)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            this.notifyService.success(response.message, 'Success');
            //this.router.navigateByUrl('course/manage-list');
          } else {
            //this.removeFromUserList('availableUsers',users);
            //this.updateUserList('assignedUsers',users);
            this.notifyService.error(response.message, 'Error');
          }
        },
        (err: IHttpResponse) => {
          //this.removeFromUserList('availableUsers',users);
          //this.updateUserList('assignedUsers',users);
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
}
