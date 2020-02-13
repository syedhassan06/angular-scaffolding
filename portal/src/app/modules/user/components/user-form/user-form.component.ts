import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Validator } from '@portal/shared/utils/validator';
import { USER_ROLE, IUserRole, IUser, IAction } from '@portal/core/models';

@Component({
  selector: 'lms-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  userPasswordForm: FormGroup;
  userRole: IUserRole = USER_ROLE;
  action: IAction = 'add';
  page = {
    add: { title: 'Add User' },
    edit: { title: 'Edit User' }
  };

  @Input() dealerships = [];
  @Input()
  set user(data: IUser) {
    if (data) {
      this.userForm.patchValue(data);
      this.populateSelectedRole(data);
      this.action = 'edit';
    }
  }
  @Output() save$ = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() {}

  buildForm() {
    this.userForm = this.formBuilder.group({
      id: [0, []],
      dealership: [[], []],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role_id: [[3]]
    });
    this.userPasswordForm = this.formBuilder.group(
      {
        password: ['', [Validators.minLength(6)]],
        cpassword: ['']
      },
      {
        validator: Validator.passwordMatching.bind(this)
      }
    );
  }

  onSave() {
    if (this.userForm.valid) {
      const data = { ...this.userForm.value };

      const password: string = this.userPasswordForm.get('password').value;
      if (this.userPasswordForm.valid && password && password.trim() !== '') {
        data['password'] = password;
      }
      if (!data.id) {
        if (Array.isArray(data.dealership) && data.dealership.length > 0) {
          data.dealership_id = data.dealership.map(item => item.id);
        }
        delete data.id;
      }
      delete data.dealership;
      this.save$.emit(data);
    }
  }

  get userAccessRoles(): string[] {
    let options: string[] = [];
    const userRoleKeys = Object.keys(this.userRole);
    if (userRoleKeys.length > 0) {
      options = userRoleKeys.slice(userRoleKeys.length / 2);
    }
    return options;
  }

  onCheckRole(event: Event, value: string) {
    const chkElement: HTMLInputElement = <HTMLInputElement>event.target,
      userRoleControl: FormControl = <FormControl>this.userForm.get('role_id'),
      selectedValue = this.userRole[value],
      foundRoleIndex = userRoleControl.value.findIndex(
        item => item == selectedValue
      ),
      roles = userRoleControl.value as Array<any>;

    if (chkElement.checked) {
      if (foundRoleIndex === -1) roles.push(selectedValue);
    } else {
      roles.splice(foundRoleIndex, 1);
    }
    userRoleControl.setValue(roles);
  }

  populateSelectedRole(data: IUser) {
    this.userForm.get('role_id').setValue(
      data.roles.map(item => {
        return item.id;
      })
    );
  }
}
