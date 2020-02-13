import { finalize, takeUntil } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap';
import { Component, OnInit } from '@angular/core';
import { DealershipService, NotificationService } from '@portal/core/services';
import { Subject } from 'rxjs';
import { IDealerGroup, IHttpResponse } from '@portal/core/models';
import { deepCopy } from '@portal/shared/utils/helper';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'lms-dealergroup-manager-modal',
  templateUrl: './dealergroup-manager-modal.component.html',
  styleUrls: ['./dealergroup-manager-modal.component.scss']
})
export class DealergroupManagerModalComponent implements OnInit {
  private readonly destroyed$ = new Subject<void>();
  selectedDealergroup: IDealerGroup = null;
  dataSource = null;
  dealergroupManagersMapped = [];
  dealergroupManagersSelectedMapped = [];
  dealergroupManagersInitialSelectedMapped = [];

  constructor(
    private dealershipService: DealershipService,
    public bsModalRef: BsModalRef,
    private spinner: NgxSpinnerService,
    private notifyService: NotificationService
  ) {}

  ngOnInit() {
    if (this.dataSource && this.dataSource.dealerships) {
      this.dealergroupManagersMapped = this._dealergroupManagerDataPresenter(
        this.dataSource.dealerships
      );
    }
    //this.fetchAllDealergroupManagers();
  }

  private _dealergroupManagerDataPresenter(dealerships) {
    const data = deepCopy(dealerships);
    if (Array.isArray(data) && data.length > 0) {
      return data.map(item => {
        const childrens = this._populateManagersToDealerships(item.managers);

        return {
          label: `${item.name}`,
          value: item.id,
          children: childrens.map(childItem => {
            const dealershipUser = {
              label: `${childItem.first_name} ${childItem.last_name} (${
                childItem.email
              })`,
              value: childItem.id,
              type: 'manager',
              parentID: item.id,
              relationshipID: childItem.relationshipID || 0
            };
            if (childItem.selected) {
              this.dealergroupManagersSelectedMapped.push(dealershipUser);
              this.dealergroupManagersInitialSelectedMapped.push(
                dealershipUser
              );
            }
            return dealershipUser;
          })
        };
      });
    } else {
      return [];
    }
  }

  private _populateManagersToDealerships(associatedManagers) {
    if (this.dataSource && Array.isArray(this.dataSource.managers)) {
      return this.dataSource.managers.map(manager => {
        if (Array.isArray(associatedManagers)) {
          const foundMnager = associatedManagers.find(
            associatedManager => associatedManager.id === manager.id
          );
          manager.selected = foundMnager ? true : false;
          manager.relationshipID = foundMnager
            ? foundMnager.relationship_id
            : 0;
        }
        return manager;
      });
    }
    return [];
  }

  private _formatDealershipPayloadData() {
    let dealerships;

    if (Array.isArray(this.dealergroupManagersSelectedMapped)) {
      dealerships = this.dealergroupManagersSelectedMapped
        .filter(item => !item.children)
        .map(item => ({
          deleted: false,
          relationshipID: item.relationshipID,
          manager_id: item.value,
          dealership_id: (item.parent && item.parent.value) || item.parentID
        }));

      this.dealergroupManagersInitialSelectedMapped.forEach(
        initialDealershipItem => {
          const foundItemIndex = dealerships.findIndex(
            item => initialDealershipItem.relationshipID === item.relationshipID
          );

          if (foundItemIndex === -1) {
            dealerships.push({
              deleted: true,
              relationshipID: initialDealershipItem.relationshipID,
              manager_id: initialDealershipItem.value,
              dealership_id:
                (initialDealershipItem.parent &&
                  initialDealershipItem.parent.value) ||
                initialDealershipItem.parentID
            });
          }
        }
      );
    }
    return dealerships;
  }

  onSaveUsers() {
    const data: any = {
      dealergroup_id: this.selectedDealergroup.id,
      dealerships: []
    };

    if (Array.isArray(this.dealergroupManagersSelectedMapped)) {
      data['dealerships'] = this.dealergroupManagersSelectedMapped
        .filter(item => !item.children)
        .map(item => ({
          deleted: false,
          relationshipID: item.relationshipID,
          manager_id: item.value,
          dealership_id: (item.parent && item.parent.value) || item.parentID
        }));

      this.dealergroupManagersInitialSelectedMapped.forEach(
        initialDealershipItem => {
          const foundItemIndex = data['dealerships'].findIndex(
            item => initialDealershipItem.relationshipID === item.relationshipID
          );

          if (foundItemIndex === -1) {
            data['dealerships'].push({
              deleted: true,
              relationshipID: initialDealershipItem.relationshipID,
              manager_id: initialDealershipItem.value,
              dealership_id:
                (initialDealershipItem.parent &&
                  initialDealershipItem.parent.value) ||
                initialDealershipItem.parentID
            });
          }
        }
      );
    }
    data['dealerships'] = this._formatDealershipPayloadData();
    //console.log("data",data);
    //console.log("this.dealergroupManagersSelectedMapped",this.dealergroupManagersSelectedMapped);
    //return;
    this.spinner.show();
    this.dealershipService
      .updateDealergroupManager(data)
      .pipe(
        finalize(() => {
          this.spinner.hide();
          this.bsModalRef.hide();
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            this.bsModalRef.hide();
            this.notifyService.success(response.message, 'Success');
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
