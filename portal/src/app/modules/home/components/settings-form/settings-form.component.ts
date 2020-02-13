import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IAction } from '@portal/core/models';

@Component({
  selector: 'lms-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.css']
})
export class SettingsFormComponent implements OnInit {
  settingForm: FormGroup;
  action: IAction = 'add';
  page = {
    add: { title: 'Create Dealer Group' },
    edit: { title: 'Edit Dealer Group' }
  };
  @Input()
  set settings(data: any) {
    if (data) {
      this.settingForm.patchValue(data);
      this.action = 'edit';
    }
  }
  @Output() save$ = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.settingForm = this.formBuilder.group({
      id: [1, []],
      app_name: ['', [Validators.required]],
      email_from_address: ['', [Validators.required, Validators.email]],
      email_from_name: ['', [Validators.required]],
      terms_of_use: ['', []]
    });
  }

  onSave() {
    if (this.settingForm.valid) {
      const data = { ...this.settingForm.value };
      this.save$.emit(data);
    }
  }
}
