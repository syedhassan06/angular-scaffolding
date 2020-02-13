import { Router, UrlSerializer } from '@angular/router';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { STATUS, IUser } from '@portal/core/models';
import { ConfirmationService } from '@portal/shared/components/confirm-dialog/confirm-dialog.service';
import { getRoleList } from '@portal/shared/utils/helper';
import { JwtService } from '@portal/core/services';
@Component({
  selector: 'lms-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @Input() users: IUser[] = [];
  @Output() delete$ = new EventEmitter<IUser>();
  @Output() updateStatus$ = new EventEmitter<IUser>();
  @Output() sendEmail$ = new EventEmitter<IUser>();
  selectedUser: IUser = null;
  tableFilters = ['email', 'first_name', 'last_name'];
  status = STATUS;
  cols = [
    {
      field: 'first_name',
      header: 'Name',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'email',
      header: 'Email',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'dealership',
      header: 'Dealership',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'role',
      header: 'Role',
      filterType: 'select',
      filter: true,
      filterMatchMode: 'contains',
      options: getRoleList()
    },
    {
      header: 'Active/In-Active',
      field: 'id'
    },
    {
      header: 'Action',
      field: 'role'
    }
  ];
  constructor(
    private confirmService: ConfirmationService,
    private jwtService: JwtService,
    private router: Router,
    private serializer: UrlSerializer
  ) {}

  ngOnInit() {}

  onOpenConfirmModal(user: IUser): void {
    this.selectedUser = user;
    this.confirmService.confirm(
      {
        title: 'Confirmation',
        content: 'Are you sure you want to delete',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes'
      },
      () => {
        this.deleteUser();
      },
      () => {}
    );
  }

  deleteUser() {
    this.delete$.emit(this.selectedUser);
  }

  onGuestLogin(user) {
    const tree = this.router.createUrlTree([], {
      queryParams: {
        guest: 1,
        email: user.email,
        login_key: this.jwtService.getToken()
      }
    });
    window.open('/login' + this.serializer.serialize(tree), '_blank');
  }

  onChangeStatus(user) {
    this.updateStatus$.emit(user);
  }

  onEmailSend(user) {
    this.sendEmail$.emit(user);
  }
}
