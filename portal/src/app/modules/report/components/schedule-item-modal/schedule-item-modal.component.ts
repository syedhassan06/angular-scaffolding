import { Observable } from 'rxjs/Observable';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { WeekDay } from '@angular/common';
import * as moment from 'moment';
import { takeUntil, finalize, takeWhile } from 'rxjs/operators';
import {
  ReportService,
  NotificationService,
  DealershipService,
  UserService
} from '@portal/core/services';
import {
  IDealershipLearner,
  IHttpResponse,
  ILearner
} from '@portal/core/models';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { NullViewportScroller } from '@angular/common/src/viewport_scroller';
import { deepCopy, interpolate } from '@portal/shared/utils/helper';

interface IDealershipAssignedManager {
  manager_id: number;
  manager_name: string;
  id: number;
  name: string;
}

interface IManagerDealership {
  label: string;
  value: string;
  name: string;
  id: number;
  dealerships: Array<IDealershipAssignedManager>;
}

interface IDealershipWithUser {
  label: string;
  value: string;
  name: string;
  id: number;
  users: Array<ILearner>;
}

interface IReportConfig {
  label: string;
  value: string;
  endpoint$: Observable<any>;
}

interface IReportOf {
  label: string;
  value: string;
  id: number;
  childs: Array<{
    id: number;
    label: string;
    parent_id: number;
    value: string;
  }>;
}

@Component({
  selector: 'lms-schedule-item-modal',
  templateUrl: './schedule-item-modal.component.html',
  styleUrls: ['./schedule-item-modal.component.scss']
})
export class ScheduleItemModalComponent implements OnInit, OnDestroy {
  userReport = {
    report_of: {
      source: [
        {
          label: 'Dealergroups',
          value: 'dealergroups',
          endpoint$: this.dealershipService.getDealergroupWithDealerships()
        },
        {
          label: 'Dealerships',
          value: 'dealerships',
          endpoint$: this.dealershipService.getDealershipWithLearners()
        },
        //{ label: "Managers of a Dealerships", value: "managers", endpoint$: this.dealershipService.getManagersWithDealerships() },
        {
          label: 'Other Users ',
          value: 'other_users',
          endpoint$: this.dealershipService.getDealershipWithoutLearners()
        },
        { label: 'All Users', value: 'all_users', endpoint$: null }
      ],
      reset: false,
      selected: null,
      loading: false,
      response: null,
      users: []
    },
    report_to: {
      source: [
        {
          label: 'Administrators',
          value: 'administrators',
          endpoint$: this.userService.getAllUsersByRoleID(1)
        },
        {
          label: 'Managers',
          value: 'managers',
          endpoint$: this.userService.getAllUsersByRoleID(2)
        },
        {
          label: 'Learners',
          value: 'learners',
          endpoint$: this.userService.getAllUsersByRoleID(3)
        }
      ],
      reset: false,
      selected: null,
      loading: false,
      response: null,
      users: []
    }
  };
  private readonly destroyed$ = new Subject<void>();
  saved = false;
  scheduleForm: FormGroup;
  scheduleTimelineForm: FormGroup;
  selectedSchedule: any;
  managerList: any;
  dealershipedLearners: IDealershipLearner[] = [];
  dataSource = {
    schedule: [
      { label: 'Once', value: 'once' },
      { label: 'Daily', value: 'daily' },
      { label: 'Weekly', value: 'weekly' },
      { label: 'Monthly', value: 'monthly' }
    ],
    weekDays: this.getWeekDays(),
    managers: [],
    dealershipedLearners: []
  };
  userTypeMapped;
  reportTypes = [
    //{ label: 'All Courses', value: 'all_courses' },
    { label: 'Course Progress', value: 'Progress Report' },
    { label: 'Course Completion', value: 'Course Completion Report' }
    //{ label: 'Course Certificate', value: 'Course_Certificate' },
    //{ label: 'User Course Registration', value: 'User Course Registration' },
    //{ label: 'User Registration', value: 'User Registration' },
    //{ label: 'User Login', value: 'User_Login' },
    //{ label: 'All Dealerships', value: 'All_Dealerships' },
    //{ label: 'Lesson Progress', value: 'Lesson_Progress' },
    //{ label: 'Activity Log', value: 'Activity_Log' },
    //{ label: 'Report Card', value: 'Report Card' },
  ];
  page = {
    add: { title: 'New Schedule' },
    edit: { title: 'Edit Schedule' }
  };
  action: 'add' | 'edit' = 'add';

  constructor(
    private notifyService: NotificationService,
    public bsModalRef: BsModalRef,
    private reportService: ReportService,
    private dealershipService: DealershipService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    if (this.selectedSchedule) {
      this.action = 'edit';
      this.populateSchedule();
    } else {
      this.scheduleForm
        .get('bcc_email_addresses')
        .setValue(['mtuno@getarmd.com', 'mzedaker@getarmd.com']);
    }
    this.dataSource.managers = this.managerDataSourcePresenter(
      this.managerList
    );
    this.dataSource.dealershipedLearners = this.dealershipDataSourcePresenter(
      this.dealershipedLearners
    );
    if (Array.isArray(this.managerList) && this.managerList.length <= 0) {
      this.fetchAllManagers();
    }
    if (
      Array.isArray(this.dealershipedLearners) &&
      this.dealershipedLearners.length <= 0
    ) {
      this.fetchAllDealershipUsers();
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  buildForm() {
    this.scheduleForm = this.formBuilder.group({
      id: [0, []],
      schedule_title: ['', [Validators.required]],
      user_type: [],
      report_of_type: ['all', [Validators.required]],
      report_of: ['', [Validators.required]],
      report_to: ['', [Validators.required]],
      report_of_users: [[], []],
      report_to_users: [[], []],
      report_type: ['', [Validators.required]],
      dealerships: [[], []],
      bcc_email_addresses: [[]],
      email_subject: ['', [Validators.required]],
      email_body: ['', [Validators.required]],
      format_type: ['pdf', []]
      //daterange: [null, [Validators.required]]
    });
    this.scheduleTimelineForm = this.formBuilder.group({
      schedule_type: ['once', []],
      selected: ['once'],
      weekly: ['sunday', []],
      monthly: ['', []],
      //schedule_data: ['week', []],
      start_time: [new Date(), []],
      start_date: [new Date(), []]
    });
  }

  onChangeSchedule(selectedItem) {
    this.scheduleTimelineForm.get('selected').setValue(selectedItem.value);
  }

  getWeekDays() {
    const weekDays = WeekDay;
    const weekDayNumList = Object.keys(weekDays).splice(
      0,
      Object.keys(weekDays).length / 2
    );
    if (Array.isArray(weekDayNumList)) {
      return weekDayNumList.map(num => {
        return {
          label: weekDays[num],
          value: weekDays[num].toLowerCase()
        };
      });
    }
    return [];
  }

  onSave() {
    this.markFormGroupTouched(this.scheduleForm);
    let payload = {};
    if (this.scheduleForm.valid) {
      const scheduleFormValues = this.scheduleForm.value;
      payload = {
        schedule_title: scheduleFormValues.schedule_title,
        report_type: scheduleFormValues.report_type,
        //dealerships: this.managerDealershipFormPresenter(scheduleFormValues.dealerships),
        bcc_email_addresses: scheduleFormValues.bcc_email_addresses.join(','),
        email_subject: scheduleFormValues.email_subject,
        format_type: scheduleFormValues.format_type,
        email_body: scheduleFormValues.email_body,
        report_of_users: scheduleFormValues.report_of_type,
        report_of: {
          filter_type: scheduleFormValues.report_of,
          users: []
        },
        report_to: {
          filter_type: scheduleFormValues.report_to,
          users: []
        }
        //start_range : moment(scheduleFormValues.daterange[0]).format("YYYY-MM-DD"),
        //end_range :   moment(scheduleFormValues.daterange[1]).format("YYYY-MM-DD"),
      };
      if (Array.isArray(scheduleFormValues.report_of_users)) {
        scheduleFormValues.report_of_users.forEach(item => {
          if (
            item.childs &&
            Array.isArray(item.childs) &&
            item.childs.length > 0
          ) {
            payload['report_of'].users.push(
              ...item.childs.map(childItem => ({
                parent_id: item.id,
                child_id: childItem.id
              }))
            );
          } else {
            payload['report_of'].users.push({
              parent_id: item.parent_id,
              child_id: item.id
            });
          }
        });
      }
      if (Array.isArray(scheduleFormValues.report_to_users)) {
        payload['report_to'].users = scheduleFormValues.report_to_users.map(
          item => item.id
        );
      }
      if (scheduleFormValues.id) payload['id'] = scheduleFormValues.id;
    }
    //console.log('payload',payload);
    //return;
    if (this.scheduleTimelineForm.valid) {
      const scheduleTimelineFormValues = this.scheduleTimelineForm.value;
      payload = {
        ...payload,
        schedule_type: scheduleTimelineFormValues.schedule_type,
        schedule_data:
          (scheduleTimelineFormValues.selected === 'weekly' &&
            scheduleTimelineFormValues.weekly) ||
          (scheduleTimelineFormValues.selected === 'monthly' &&
            scheduleTimelineFormValues.monthly) ||
          null,
        start_time: moment(scheduleTimelineFormValues.start_time).format(
          'HH:mm:ss'
        ),
        start_date: moment(scheduleTimelineFormValues.start_date).format(
          'YYYY-MM-DD'
        )
      };
    }
    if (this.scheduleForm.valid && this.scheduleTimelineForm.valid) {
      this.spinner.show();
      this.reportService
        .saveSchedule(payload)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          }),
          takeUntil(this.destroyed$)
        )
        .subscribe(
          (response: IHttpResponse) => {
            if (response.status) {
              this.notifyService.success(response.message, 'Success');
              this.bsModalRef.hide();
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
  }

  populateSchedule() {
    this.spinner.show();
    this.reportService
      .getSchedule(this.selectedSchedule.id)
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntil(this.destroyed$)
      )
      .subscribe((response: IHttpResponse) => {
        const data = response.data;
        this.selectedSchedule = data;
        this.selectedSchedule = Object.assign({}, this.selectedSchedule, {
          report_of: this.selectedSchedule.get_report_of,
          report_to: this.selectedSchedule.send_report_to,
          report_of_type: this.selectedSchedule.report_of_users,
          report_of_users: [],
          report_to_users: []
        });

        this.formPresenter();
        Array(this.scheduleForm, this.scheduleTimelineForm).forEach(
          iteratedScheduleForm =>
            iteratedScheduleForm.patchValue(this.selectedSchedule)
        );
        this.setScheduleFormvalues();
        this.spinner.hide();
      });
  }

  formPresenter() {
    if (this.selectedSchedule.start_range && this.selectedSchedule.end_range) {
      this.selectedSchedule.daterange = [
        moment(this.selectedSchedule.start_range).toDate(),
        moment(this.selectedSchedule.end_range).toDate()
      ];
    }

    if (this.selectedSchedule.start_date) {
      this.selectedSchedule.start_date = moment(
        this.selectedSchedule.start_date
      ).toDate();
    }

    if (this.selectedSchedule.start_time) {
      this.selectedSchedule.start_time = moment(
        this.selectedSchedule.start_time,
        'HH:mm:ss'
      ).toDate();
    }

    if (this.selectedSchedule.bcc_email_addresses) {
      this.selectedSchedule.bcc_email_addresses = this.selectedSchedule.bcc_email_addresses.split(
        ','
      );
    }
  }

  setScheduleFormvalues() {
    const scheduleTimelineForm = {};

    if (this.selectedSchedule.schedule_type) {
      scheduleTimelineForm['selected'] = this.selectedSchedule.schedule_type;
    }

    if (this.selectedSchedule.schedule_data) {
      if (this.selectedSchedule.schedule_type === 'weekly') {
        scheduleTimelineForm['weekly'] = this.selectedSchedule.schedule_data;
      } else if (this.selectedSchedule.schedule_type === 'monthly') {
        scheduleTimelineForm['monthly'] = this.selectedSchedule.schedule_data;
      }
    }

    if (this.selectedSchedule.schedule_type) {
      scheduleTimelineForm['selected'] = this.selectedSchedule.schedule_type;
    }

    if (this.selectedSchedule.bcc_email_addresses === '') {
      this.scheduleForm.get('bcc_email_addresses').setValue([]);
    }
    //this.selectManagers();
    this.triggerUsersReportCallback();
    this.scheduleTimelineForm.patchValue(scheduleTimelineForm);
  }

  selectManagers() {
    if (
      Array.isArray(this.dataSource.managers) &&
      this.dataSource.managers.length > 0 &&
      this.selectedSchedule
    ) {
      const filteredManagers = [];
      //console.log("this.dataSource.managers", this.dataSource.managers)
      this.dataSource.managers.forEach((manager: IManagerDealership) => {
        const _manager = this.selectedSchedule.managers.filter(
          selectedFormManager => {
            return selectedFormManager.manager_id === manager.id;
          }
        );
        if (_manager.length > 0) {
          const _dealerships = _manager.map(itemManagerDealership => {
            return manager.dealerships.find(
              dealership =>
                itemManagerDealership.dealership_id === dealership.id
            );
          });
          // const _dealerships2 = manager.dealerships.filter((dealership) =>{
          //   return this.selectedSchedule.managers.find((_iteratedDealership)=>_iteratedDealership.dealership_id===dealership.id);
          // });
          filteredManagers.push(..._dealerships);
          //return _manager;
        }
      });
      //console.log("filteredManagers",filteredManagers)
      if (filteredManagers.length > 0) {
        this.scheduleForm.get('dealerships').setValue(filteredManagers);
      }
    }
  }

  triggerUsersReportCallback() {
    if (this.selectedSchedule) {
      this.onChangeReportOf(this.selectedSchedule.report_of);
      this.onChangeReportTo(this.selectedSchedule.report_to);
    }
  }

  selectedReportedUser() {
    if (!this.userReport.report_of.reset && this.selectedSchedule) {
      this.userReport.report_of.reset = true;
    } else {
      return false;
    }
    if (
      Array.isArray(this.userReport.report_of.users) &&
      this.userReport.report_of.users.length > 0 &&
      this.selectedSchedule
    ) {
      const filteredUsers = [];

      this.userReport.report_of.users.forEach((iteratedUser: IReportOf) => {
        const _user = this.selectedSchedule.get_report_of_users.filter(item => {
          if (this.selectedSchedule.get_report_of === 'other_users') {
            return item.child_id === iteratedUser.id;
          }
          return item.parent_id === iteratedUser.id;
        });
        if (_user.length > 0) {
          if (this.selectedSchedule.get_report_of !== 'other_users') {
            const _userChilds = _user.map(parentChildIDs => {
              return iteratedUser.childs.find(
                iteratedChild => parentChildIDs.child_id === iteratedChild.id
              );
            });
            filteredUsers.push(..._userChilds);
          } else {
            filteredUsers.push(iteratedUser);
          }
        }
      });

      if (filteredUsers.length > 0) {
        this.scheduleForm.get('report_of_users').setValue(filteredUsers);
      }
    }
  }

  selectedReportToUsers() {
    if (!this.userReport.report_to.reset && this.selectedSchedule) {
      this.userReport.report_to.reset = true;
    } else {
      return false;
    }
    if (
      Array.isArray(this.userReport.report_to.users) &&
      this.selectedSchedule
    ) {
      let filteredUsers = [];

      if (Array.isArray(this.selectedSchedule.send_report_to_users)) {
        filteredUsers = this.selectedSchedule.send_report_to_users.map(
          selectedUser => {
            return this.userReport.report_to.users.find(
              iteratedUser => selectedUser.user_id === iteratedUser.id
            );
          }
        );
      } else {
        filteredUsers = [];
      }
      if (filteredUsers.length > 0) {
        this.scheduleForm.get('report_to_users').setValue(filteredUsers);
      }
    }
  }

  selectDealerships() {
    if (
      Array.isArray(this.dataSource.dealershipedLearners) &&
      this.dataSource.dealershipedLearners.length > 0 &&
      this.selectedSchedule
    ) {
      const filteredDealerships = [];
      //console.log("this.dataSource.managers", this.dataSource.managers)
      this.dataSource.dealershipedLearners.forEach(
        (manager: IDealershipLearner) => {
          const _dealership = this.selectedSchedule.managers.filter(
            selectedFormManager => {
              return selectedFormManager.manager_id === manager.id;
            }
          );
          if (_dealership.length > 0) {
            const _dealerships = _dealership.map(itemManagerDealership => {
              return manager.users.find(
                dealership =>
                  itemManagerDealership.dealership_id === dealership.id
              );
            });

            filteredDealerships.push(..._dealerships);
          }
        }
      );
      //console.log("filteredManagers",filteredManagers)
      if (filteredDealerships.length > 0) {
        this.scheduleForm
          .get('dealershipedLearners')
          .setValue(filteredDealerships);
      }
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  fetchAllManagers() {
    this.reportService
      .getAllManagers()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        const managers = response.status ? response.data : [];
        this.dataSource.managers = this.managerDataSourcePresenter(managers);
        this.selectManagers();
      });
  }

  fetchAllDealershipUsers() {
    this.dealershipService
      .getDealershipWithLearners()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        const dealershipedUsers = response.status ? response.data : [];
        this.dataSource.dealershipedLearners = this.dealershipDataSourcePresenter(
          dealershipedUsers
        );
        this.selectManagers();
      });
  }

  onRemoveUserFromDropdown(user) {
    const emailControl = this.scheduleForm.controls['dealerships'];
    const users = emailControl.value as Array<any>;
    const foundSelectedUserIndex = users.findIndex(item => item.id === user.id);
    users.splice(foundSelectedUserIndex, 1);
    emailControl.setValue(users);
  }

  onRemoveUserFromFormControl(user, controlName) {
    const inputControl = this.scheduleForm.controls[controlName];
    const users = inputControl.value as Array<any>;
    const foundSelectedUserIndex = users.findIndex(item => item.id === user.id);
    users.splice(foundSelectedUserIndex, 1);
    inputControl.setValue(users);
  }

  searchUserCallback(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item.name.toLocaleLowerCase().indexOf(term) > -1 ||
      item.name.toLocaleLowerCase() === term ||
      (item.manager_name.toLocaleLowerCase().indexOf(term) > -1 ||
        item.manager_name.toLocaleLowerCase() === term)
    );
  }

  searcReporthUserCallback(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item.label.toLocaleLowerCase().indexOf(term) > -1 ||
      item.label.toLocaleLowerCase() === term
    );
  }

  managerDataSourcePresenter(managers: any[] = []): Array<IManagerDealership> {
    if (Array.isArray(managers)) {
      return managers.map(item => {
        return {
          label: item.name + ' (' + item.email + ')',
          value: item.email,
          name: item.name,
          id: item.id,
          dealerships: item.dealerships.map(dealershipItem => {
            return {
              ...dealershipItem,
              manager_id: item.id,
              manager_name: item.name
            };
          })
        };
      });
    } else {
      return [];
    }
  }

  dealershipDataSourcePresenter(
    dealerships: IDealershipLearner[] = []
  ): Array<IDealershipWithUser> {
    if (Array.isArray(dealerships)) {
      return dealerships.map((item: IDealershipLearner) => {
        return {
          label: item.name,
          value: item.name,
          name: item.name,
          id: item.id,
          users: item.users.map(userItem => {
            return { ...userItem, user_id: item.id, user_name: item.name };
          })
        };
      });
    } else {
      return [];
    }
  }

  managerDealershipFormPresenter(
    managers: Array<IManagerDealership & IDealershipAssignedManager> = []
  ): Array<{ manager_id: number; dealership_id: number }> {
    const data = [];
    if (Array.isArray(managers) && managers.length > 0) {
      managers.forEach(
        (item: IManagerDealership & IDealershipAssignedManager) => {
          if (Array.isArray(item.dealerships) && item.dealerships.length > 0) {
            data.push(
              ...item.dealerships.map(dealership => {
                return {
                  manager_id: item.id,
                  dealership_id: dealership.id
                };
              })
            );
          } else {
            data.push({
              manager_id: item.manager_id,
              dealership_id: item.id
            });
          }
        }
      );
      return data;
    } else {
      return [];
    }
  }

  userDataSourcePresenter(source: any, type: string) {
    const mappedField = {
      parent: { id: 'id', label: 'name' },
      child: { id: 'id', label: '${name}', parentChildField: '' }
    };
    switch (type) {
      case 'dealergroups':
      case 'managers':
        mappedField['child']['parentChildField'] = 'dealerships';
        break;
      case 'dealerships':
        mappedField['child']['parentChildField'] = 'users';
        break;
      case 'other_users':
        mappedField['child']['parentChildField'] = '';
        break;
      case 'all_users':
        mappedField['parent'] = null;
        break;
    }
    if (Array.isArray(source)) {
      const userDataSource = source.map(item => {
        const parentLabel =
          (item.name && item[mappedField.parent.label]) ||
          item.first_name + ' ' + item.last_name;
        return {
          label: parentLabel,
          value: parentLabel,
          id: item[mappedField.parent.id],
          childs:
            (mappedField.child.parentChildField &&
              item[mappedField.child.parentChildField].map(userItem => {
                const name =
                  userItem.name ||
                  userItem.first_name + ' ' + userItem.last_name;
                const nameInterpolation = interpolate(mappedField.child.label, {
                  name: name
                });
                return {
                  label: nameInterpolation,
                  value: nameInterpolation,
                  id: userItem[mappedField.child.id],
                  parent_id: item[mappedField.parent.id]
                };
              })) ||
            []
        };
      });
      return userDataSource;
    } else {
      return [];
    }
    //console.log();
  }

  userSourceWithoutHirerachyPresenter(source = []): Array<any> {
    if (Array.isArray(source)) {
      return source.map(item => {
        const name =
          (item.name && item.name) || item.first_name + ' ' + item.last_name;
        return {
          label: name,
          value: name,
          id: item.id
        };
      });
    } else {
      return [];
    }
  }

  onChangeReportOf(value: string, reportOfUserEvent = null) {
    const foundReportOf = this.userReport.report_of.source.find(
      (item: IReportConfig) => item.value === value
    );
    if (foundReportOf) {
      this.userReport.report_of.response = null;
      this.userReport.report_of.selected = foundReportOf;
      this.userReport.report_of.users = [];
      this.scheduleForm.get('report_of_users').setValue([]);

      if (foundReportOf.endpoint$) {
        this.userReport.report_of.loading = true;

        foundReportOf.endpoint$
          .pipe(
            takeWhile(() => !this.userReport.report_of.response),
            finalize(() => (this.userReport.report_of.loading = false))
          )
          .subscribe((res: IHttpResponse) => {
            this.userReport.report_of.response = res;
            const userDataSource = this.userDataSourcePresenter(
              res.data,
              value
            );
            this.userReport.report_of.users = userDataSource;
            this.selectedReportedUser();
            if (reportOfUserEvent) reportOfUserEvent.open();
          });
      }
    }
  }

  onChangeReportTo(value: string, reportToUserEvent = null) {
    const foundReportTo = this.userReport.report_to.source.find(
      (item: IReportConfig) => item.value === value
    );
    if (foundReportTo) {
      this.userReport.report_to.response = null;
      this.userReport.report_to.selected = foundReportTo;
      this.userReport.report_to.users = [];
      this.scheduleForm.get('report_to_users').setValue([]);

      if (foundReportTo.endpoint$) {
        this.userReport.report_to.loading = true;

        foundReportTo.endpoint$
          .pipe(
            takeWhile(() => !this.userReport.report_to.response),
            finalize(() => (this.userReport.report_to.loading = false))
          )
          .subscribe((res: IHttpResponse) => {
            this.userReport.report_to.response = res;
            const userDataSource = this.userSourceWithoutHirerachyPresenter(
              res.data
            );
            this.userReport.report_to.users = userDataSource;
            this.selectedReportToUsers();
            if (reportToUserEvent) reportToUserEvent.open();
          });
      }
    }
  }

  onFocusReportOfUsers(reportOfUserEvent) {
    //console.log("this.scheduleForm.get('report_of_users')", this.scheduleForm.get('report_of_users').value)
    //console.log("this.scheduleForm.get('report_to_users')", this.scheduleForm.get('report_to_users').value)
  }
}
