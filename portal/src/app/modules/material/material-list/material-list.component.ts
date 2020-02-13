import { LessonContentModalComponent } from '@portal/shared/components/lesson-content-modal/lesson-content-modal.component';
import { MaterialEmailModalComponent } from './../material-email-modal/material-email-modal.component';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { MaterialService, NotificationService } from '@portal/core/services';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmationService } from '@portal/shared/components/confirm-dialog/confirm-dialog.service';
import { IHttpResponse } from '@portal/core/models/index';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'lms-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MaterialListComponent implements OnInit, OnDestroy {
  @ViewChild('userAssignTemplate') userAssignTemplate;
  userAssignModalRef: BsModalRef;
  emailModalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  private readonly destroyed$ = new Subject<void>();
  resources = [];
  selectedMaterial;
  selectedResource: any = {};
  selectedUsers: any[] = [];
  cols = [
    {
      field: 'name',
      header: 'Materials',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    { header: 'Reference Library' },
    { header: 'Download' },
    { header: 'Active Material' },
    { header: 'Download' },
    { header: 'Date Created', field: 'created_at' },
    {
      header: 'Action'
    }
  ];
  users = [];

  constructor(
    public materialService: MaterialService,
    private notifyService: NotificationService,
    private confirmService: ConfirmationService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService
  ) {
    this.fetchAll();
  }

  ngOnInit() {
    this.modalService.onHidden.subscribe(() => {
      this.selectedResource = null;
      this.selectedUsers = [];
    });
  }

  fetchAll(): void {
    this.materialService
      .getAllMaterials()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        this.resources = response.status ? response.data : [];
      });
  }

  fetchMaterialAssignedUser(resource: any = {}): void {
    this.materialService
      .getMaterialAssignedUser(resource.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status && response.data) {
          const users = [...response.data.dealership_users];
          if (
            Array.isArray(response.data.other_users) &&
            response.data.other_users.length > 0
          ) {
            const otherUsers = {
              id: new Date().getTime(),
              name: 'Other Users',
              user: response.data.other_users
            };
            users.push(otherUsers);
          }
          this.users = this.userPresenter(users);
        } else {
          this.users = [];
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  deleteMaterial(): void {
    this.materialService
      .deleteMaterial(this.selectedResource.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            const index: number = this.resources.findIndex(
              (iteratedResource: any) => {
                return iteratedResource.id === this.selectedResource.id;
              }
            );
            this.resources.splice(index, 1);
            this.notifyService.success(response.message, 'Success');
          } else {
            this.notifyService.success(response.message, 'Error');
          }
        },
        (errResponse: IHttpResponse) => {
          this.notifyService.error(
            (errResponse && errResponse.message) || 'Something went wrong',
            'Error'
          );
        }
      );
  }

  onOpenConfirmModal(resource = {}): void {
    this.selectedResource = resource;
    this.confirmService.confirm(
      {
        title: 'Confirmation',
        content: 'Are you sure you want to delete',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes'
      },
      () => {
        this.deleteMaterial();
      },
      () => {}
    );
  }

  onMarkedResource(
    resource: any = {},
    type:
      | 'reference_library'
      | 'reference_library_downloaded'
      | 'material'
      | 'material_downloaded',
    event: Event
  ) {
    const data = {
      type: type,
      id: resource.id,
      value: (<HTMLInputElement>event.target).checked
    };
    this.materialService
      .updateMaterial(data)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            this.notifyService.success(response.message, 'Success');
          } else {
            this.notifyService.error(response.message, 'Error');
          }
        },
        (errResponse: IHttpResponse) => {
          this.notifyService.error(
            (errResponse && errResponse.message) || 'Something went wrong',
            'Error'
          );
        }
      );
  }

  onShowUserAssignModal(resource: any = {}) {
    this.selectedResource = resource;
    this.userAssignModalRef = this.modalService.show(
      this.userAssignTemplate,
      this.config
    );
    this.fetchMaterialAssignedUser(resource);
  }

  onHideUserAssignModal() {
    this.userAssignModalRef.hide();
  }

  private userPresenter(users): any[] {
    if (Array.isArray(users)) {
      return users.map(item => {
        let childrens = [];
        if (item.user && Array.isArray(item.user)) {
          childrens = item.user;
        }
        return {
          label: `${item.name}`,
          value: item.id,
          children: childrens.map(childItem => {
            const dealershipUser = {
              label: `${childItem.first_name} ${childItem.last_name} (${
                childItem.email
              })`,
              value: childItem.id,
              type: 'dealership-user'
            };
            if (childItem.selected) {
              this.selectedUsers.push(dealershipUser);
            }
            return dealershipUser;
          })
        };
      });
    } else {
      return [];
    }
  }

  onSaveUsers() {
    const data: any = { resource_id: this.selectedResource.id, user_id: [] };
    if (Array.isArray(this.selectedUsers)) {
      data['user_id'] = this.selectedUsers
        .filter(item => !item.children)
        .map(item => item.value);
    }
    this.spinner.show();
    this.materialService
      .saveUser(data)
      .pipe(
        finalize(() => {
          this.spinner.hide();
          this.userAssignModalRef.hide();
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            this.userAssignModalRef.hide();
            this.notifyService.success(response.message, 'Success');
          } else {
            this.notifyService.error(response.message, 'Error');
          }
        },
        (err: IHttpResponse) => {
          this.notifyService.error(
            (err && err.message) || 'Something went wrong',
            'Error'
          );
        }
      );
  }

  onOpenEmailModal(resource: any) {
    const initialState = {
      emailDetail: { id: 23, name: 'asf' },
      resource: resource
    };
    const config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.emailModalRef = this.modalService.show(MaterialEmailModalComponent, {
      initialState,
      ...config
    });
  }

  onEmailSend(resource: any) {
    this.materialService
      .sendEmail(resource.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            this.notifyService.success(response.message, 'Success');
          } else {
            this.notifyService.error(response.message, 'Error');
          }
        },
        (errResponse: IHttpResponse) => {
          this.notifyService.error(
            (errResponse && errResponse.message) || 'Something went wrong',
            'Error'
          );
        }
      );
  }

  onCheckAllUsers(userTreeList) {
    document
      .querySelectorAll('.dealership-wrap')
      .forEach((element: HTMLElement) => {
        if (element) {
          element.click();
        }
      });
  }

  shownLessonContent(resource) {
    const initialState = {
      selectedResource: resource
    };
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl'
    };
    this.modalService.show(LessonContentModalComponent, {
      initialState,
      ...config
    });
  }
}
