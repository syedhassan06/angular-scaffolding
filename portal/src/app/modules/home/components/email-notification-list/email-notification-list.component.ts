import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { STATUS } from '@portal/core/models';
import { ConfirmationService } from '@portal/shared/components/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'lms-email-notification-list',
  templateUrl: './email-notification-list.component.html',
  styleUrls: ['./email-notification-list.component.css']
})
export class EmailNotificationListComponent implements OnInit {
  private _emailSettings: any[];
  @Input()
  set emailSettings(data) {
    this._emailSettings = data;
    if (this._emailSettings && Array.isArray(this._emailSettings)) {
      this.updateSenderList();
    }
  }
  get emailSettings() {
    return this._emailSettings;
  }
  @Output() delete$ = new EventEmitter<any>();
  @Output() save$ = new EventEmitter<string>();
  selectedEmailSetting: any = null;
  tableFilters = ['name'];
  sender = {
    send_to_user: [],
    send_to_manager: [],
    send_to_log: []
  };
  status = STATUS;

  constructor(private confirmService: ConfirmationService) {}

  ngOnInit() {}

  onOpenConfirmModal(emailSetting: any): void {
    this.selectedEmailSetting = emailSetting;
    this.confirmService.confirm(
      {
        title: 'Confirmation',
        content: 'Are you sure you want to delete',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes'
      },
      () => {
        this.deleteEmailSetting();
      },
      () => {}
    );
  }

  deleteEmailSetting() {
    this.delete$.emit(this.selectedEmailSetting);
  }

  updateSenderList() {
    this.emailSettings.forEach((item, index) => {
      this.sender['send_to_log'][index] = item.send_to_log;
      this.sender['send_to_manager'][index] = item.send_to_manager;
      this.sender['send_to_user'][index] = item.send_to_user;
    });
  }

  handleChange(event, item, field) {
    item[field] = event.checked;
    this.save$.emit(item);
  }
}
