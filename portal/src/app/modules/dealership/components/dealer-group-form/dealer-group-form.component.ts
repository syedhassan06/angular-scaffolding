import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDealerGroup, IAction } from '@portal/core/models';

@Component({
  selector: 'lms-dealer-group-form',
  templateUrl: './dealer-group-form.component.html',
  styleUrls: ['./dealer-group-form.component.scss']
})
export class DealerGroupFormComponent implements OnInit {
  dealerGroupForm: FormGroup;
  action: IAction = 'add';
  page = {
    add: { title: 'Create Dealer Group' },
    edit: { title: 'Edit Dealer Group' }
  };
  @Input()
  set dealerGroup(data: IDealerGroup) {
    if (data) {
      this.dealerGroupForm.patchValue(data);
      this.action = 'edit';
    }
  }
  @Output() save$ = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.dealerGroupForm = this.formBuilder.group({
      id: [0, []],
      name: ['', [Validators.required]],
      is_active: [1, [Validators.required]]
    });
  }

  onSave() {
    if (this.dealerGroupForm.valid) {
      const data = { ...this.dealerGroupForm.value };
      //console.log("data",data);
      if (!data.id) delete data.id;
      this.save$.emit(data);
    }
  }
}
