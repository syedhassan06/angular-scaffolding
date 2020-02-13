import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDealerGroup, STATUS } from '@portal/core/models';
import { ConfirmationService } from '@portal/shared/components/confirm-dialog/confirm-dialog.service';
import { DealergroupModalComponent } from './../dealergroup-modal/dealergroup-modal.component';
import { DealergroupManagerModalComponent } from '../dealergroup-manager-modal/dealergroup-manager-modal.component';
import { getStatusList } from '@portal/shared/utils/helper';

@Component({
  selector: 'lms-dealer-group-list',
  templateUrl: './dealer-group-list.component.html',
  styleUrls: ['./dealer-group-list.component.css']
})
export class DealerGroupListComponent implements OnInit {
  @Input() dealerGroups: IDealerGroup[] = [];
  @Input('dealerModalSettings')
  set dealerModalSettings(data) {
    if (data) {
      this.shownDealerModal(data);
    }
  }
  @Input('dealerManagerModalSettings')
  set dealerManagerModalSettings(data) {
    if (data) {
      this.shownDealerManagerModal(data);
    }
  }
  @Output() delete$ = new EventEmitter<IDealerGroup>();
  @Output() showModal$ = new EventEmitter<any>();
  @Output() shownManager$ = new EventEmitter<any>();
  selectedDealerGroup: IDealerGroup = null;
  tableFilters = ['name'];
  status = STATUS;
  cols = [
    {
      field: 'name',
      header: 'Dealergoup',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'dealership_count',
      header: 'No. Of Dealerships'
    },
    {
      field: 'is_active',
      header: 'Status',
      filterType: 'select',
      filter: true,
      options: getStatusList(),
      filterMatchMode: 'contains'
    },
    {
      header: 'Action'
    }
  ];

  constructor(
    private confirmService: ConfirmationService,
    private bsModalService: BsModalService
  ) {}

  ngOnInit() {}

  onOpenConfirmModal(dealer: IDealerGroup): void {
    this.selectedDealerGroup = dealer;
    this.confirmService.confirm(
      {
        title: 'Confirmation',
        content: 'Are you sure you want to delete',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes'
      },
      () => {
        this.deleteDealerGroup();
      },
      () => {}
    );
  }

  deleteDealerGroup() {
    this.delete$.emit(this.selectedDealerGroup);
  }

  onOpenDealerModal(dealergroup) {
    if (dealergroup && dealergroup.dealership_count > 0) {
      this.showModal$.emit(dealergroup);
    }
  }

  shownDealerModal(modalSettings) {
    this.bsModalService.show(DealergroupModalComponent, modalSettings);
  }

  shownDealerManagerModal(modalSettings) {
    this.bsModalService.show(DealergroupManagerModalComponent, modalSettings);
  }

  onOpenManagerModal(dealergroup: IDealerGroup) {
    if (dealergroup) {
      this.shownManager$.emit(dealergroup);
    }
  }
}
