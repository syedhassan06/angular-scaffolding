import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { IDealer, IDealerGroup, IAction } from '@portal/core/models';

@Component({
  selector: 'lms-dealer-form',
  templateUrl: './dealer-form.component.html',
  styleUrls: ['./dealer-form.component.scss']
})
export class DealerFormComponent implements OnInit {
  action: IAction = 'add';
  page = {
    add: { title: 'Create Dealership' },
    edit: { title: 'Edit Dealership' }
  };
  dealerForm: FormGroup;
  @Input() dealerGroups: IDealerGroup[] = [];
  @Input()
  set dealer(data: IDealer) {
    if (data) {
      this.dealerForm.patchValue(data);
      this.action = 'edit';
    }
  }
  @Output() save$ = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.dealerForm = this.formBuilder.group({
      id: [0, []],
      name: ['', [Validators.required]],
      is_active: [1, [Validators.required]],
      dealer_group_id: [null, []]
    });
  }

  onSave() {
    if (this.dealerForm.valid) {
      const data = { ...this.dealerForm.value };
      //console.log("data",data);
      if (!data.id) delete data.id;
      this.save$.emit(data);
    }
  }
}
