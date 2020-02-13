import { ConfirmationService } from './confirm-dialog.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IModalSetting } from '@portal/core/models';

@Component({
  selector: 'lms-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  @ViewChild('confirmationTemplate') public template: TemplateRef<any>;
  subscription;
  modalRef: BsModalRef;
  settings: IModalSetting;

  constructor(
    private modalService: BsModalService,
    private confirmService: ConfirmationService
  ) {
    this.subscription = this.confirmService.confirmSubscriber.subscribe(
      (response: any) => {
        if (response === true) {
          this.prompt();
          this.confirmService._confirmEmitter.next(false);
        }
      },
      (err: any) => {}
    );
  }

  ngOnInit() {}

  onCancel(): void {
    this.confirmService.cancelCallback();
    this.modalRef.hide();
  }

  onConfirm(): void {
    this.confirmService.confirmCallback();
    this.modalRef.hide();
  }

  prompt() {
    this.settings = this.confirmService.settings;
    this.modalRef = this.modalService.show(this.template, {
      class: 'modal-sm'
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
