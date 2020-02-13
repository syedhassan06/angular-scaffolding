import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IAction } from '@portal/core/models';

@Component({
  selector: 'lms-email-notification-form',
  templateUrl: './email-notification-form.component.html',
  styleUrls: ['./email-notification-form.component.css']
})
export class EmailNotificationFormComponent implements OnInit {
  emailForm: FormGroup;
  action: IAction = 'add';
  page = {
    add: { title: 'Create Email Setting' },
    edit: { title: 'Edit Email Setting' }
  };
  @Input()
  set emailSetting(data: any) {
    if (data) {
      data.log_email_address =
        (data.log_email_address && data.log_email_address.split(';')) || [];
      this.emailForm.patchValue(data);
      this.action = 'edit';
    }
  }
  @Output() save$ = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.emailForm = this.formBuilder.group({
      id: [0, []],
      email_subject: ['', [Validators.required]],
      action: ['', [Validators.required]],
      send_to_user: [false],
      send_to_manager: [false],
      send_to_log: [false],
      email_content: [],
      log_email_address: [null]
    });
  }

  onSave() {
    if (this.emailForm.valid) {
      const data = { ...this.emailForm.value };
      if (Array.isArray(data.log_email_address)) {
        data['log_email_address'] = data['log_email_address'].join(';');
      } else {
        data['log_email_address'] = '';
      }
      //console.log("data",data);
      //return;
      if (!data.id) delete data.id;
      this.save$.emit(data);
    }
  }

  onAddChipValues(event) {
    //console.log("event",event.value)
  }
}
