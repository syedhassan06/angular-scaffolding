import { DealerCourseAssignedModalComponent } from './../dealer-course-assigned-modal/dealer-course-assigned-modal.component';
import { BsModalService } from 'ngx-bootstrap';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  forwardRef
} from '@angular/core';
import { ConfirmationService } from '@portal/shared/components/confirm-dialog/confirm-dialog.service';
import { IDealer, STATUS } from '@portal/core/models';
import { AssociateManagerComponent } from './../associate-manager/associate-manager.component';
import { AssociateLearnerComponent } from './../associate-learner/associate-learner.component';
import { getStatusList } from '@portal/shared/utils/helper';

@Component({
  selector: 'lms-dealer-list',
  templateUrl: './dealer-list.component.html',
  styleUrls: ['./dealer-list.component.scss']
})
export class DealerListComponent implements OnInit {
  @Input() dealers: IDealer[] = [];
  @Output() delete$ = new EventEmitter<IDealer>();
  @ViewChild(forwardRef(() => AssociateLearnerComponent)) associateLearnerModal;
  @ViewChild(forwardRef(() => AssociateManagerComponent)) associateManagerModal;
  selectedDealer: IDealer = null;
  tableFilters = ['name'];
  status = STATUS;
  cols = [
    {
      field: 'id',
      header: 'ID'
    },
    {
      field: 'name',
      header: 'Dealership',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'dealergroup',
      header: 'Dealergroup',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
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
      field: 'created_at',
      header: 'Date Created',
      filterType: 'input',
      filter: true,
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

  onOpenConfirmModal(dealer: IDealer): void {
    this.selectedDealer = dealer;
    this.confirmService.confirm(
      {
        title: 'Confirmation',
        content: 'Are you sure you want to delete',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes'
      },
      () => {
        this.deleteDealer();
      },
      () => {}
    );
  }

  deleteDealer() {
    this.delete$.emit(this.selectedDealer);
  }

  onOpenModal(actionType: string, dealer: IDealer) {
    if (actionType === 'learner') {
      this.associateLearnerModal.selectedDealer = dealer;
      this.associateLearnerModal.selectedActionType = actionType;
      this.associateLearnerModal.show();
    } else if (actionType === 'manager') {
      this.associateManagerModal.selectedDealer = dealer;
      this.associateManagerModal.selectedActionType = actionType;
      this.associateManagerModal.show();
    }
  }

  onShownCourses(dealer: IDealer) {
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl',
      initialState: {
        selectedDealership: dealer
      }
    };
    this.bsModalService.show(DealerCourseAssignedModalComponent, config);
  }
}
