import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ChangeDetectionStrategy,
  forwardRef
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IDealer } from '@portal/core/models';
import { AssociateManagerComponent } from '../';
import { AssociateLearnerComponent } from '../associate-learner/associate-learner.component';

@Component({
  selector: 'lms-dealership-popup',
  templateUrl: './dealership-popup.component.html',
  styleUrls: ['./dealership-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DealershipPopupComponent implements OnInit {
  @ViewChild('dealerModalTemplate') dealerModalTemplate;
  //@ViewChild('t1') associateLearnerComponent;
  // @ViewChild(AssociateManagerComponent) managerLearnerComponent;
  @Input() selectedActionType: 'manager' | 'learner';
  @Input()
  set selectedDealer(data: IDealer) {
    //console.log(this.associateLearnerComponent);
    if (data) {
      //this.associateLearnerComponent.selectedDealer = data;
    }
    //this.managerLearnerComponent.selectedDealer = data;
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

  constructor(private modalService: BsModalService) {}

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
}
