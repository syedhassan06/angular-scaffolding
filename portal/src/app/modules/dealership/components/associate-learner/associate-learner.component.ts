import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { DealershipService, NotificationService } from '@portal/core/services';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  IDealer,
  IHttpResponse,
  IAssociateLearner,
  IAssociate
} from '@portal/core/models';
import { takeUntil, finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'lms-associate-learner',
  templateUrl: './associate-learner.component.html',
  styleUrls: ['./associate-learner.component.scss']
})
export class AssociateLearnerComponent implements OnInit, OnDestroy {
  @ViewChild('dealerModalTemplate') dealerModalTemplate;
  @Input()
  set selectedDealer(data: IDealer) {
    if (data) {
      this._dealer = data;
      this.fetchAvailableLearners(data);
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

  learners: IAssociateLearner = {
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

  fetchAvailableLearners(dealer: IDealer) {
    this.dealershipService
      .getAvailableLearners(dealer.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res: IHttpResponse) => {
        if (res.status) {
          this.learners = { ...this.learners, ...res.data };
        }
      });
  }

  onLearnerAssigned(event) {
    const users: IAssociate[] = event.items;
    const userIDs: any[] = users.map((item: IAssociate) => item.id);
    const data = { user_id: userIDs, dealership_id: this.selectedDealer.id };
    this.spinner.show();
    this.dealershipService
      .addLearner(data)
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

  onLearnerUnAssigned(event) {
    const users: IAssociate[] = event.items;
    const userIDs: any[] = users.map((item: IAssociate) => item.id);
    const data = { user_id: userIDs, dealership_id: this.selectedDealer.id };
    this.spinner.show();
    this.dealershipService
      .removeLearner(data)
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

  test(event) {
    console.log(event);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
