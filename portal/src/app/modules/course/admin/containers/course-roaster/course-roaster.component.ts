import { IUserAvailableCourse } from './../../../../../core/models/course.model';
import { Subject, of } from 'rxjs';
import { CourseService } from '@portal/core/services/course.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '@portal/core/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap, takeUntil, finalize } from 'rxjs/operators';
import {
  IUserCourse,
  IHttpResponse,
  ICourseItem,
  IUserAssignedCourse
} from '@portal/core/models';

@Component({
  selector: 'lms-course-roaster',
  templateUrl: './course-roaster.component.html',
  styleUrls: ['./course-roaster.component.scss']
})
export class CourseRoasterComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  user: IUserCourse = {
    availableUsers: [],
    assignedUsers: [],
    otherUsersAssigned: [],
    otherUsersAvailable: []
  };
  selectedCourse: ICourseItem = null;
  data = {
    source: [],
    target: []
  };
  course: ICourseItem;
  availableUsers = { dataSource: [], selected: [] };
  assignedUsers = { dataSource: [], selected: [] };
  response = null;
  constructor(
    private courseService: CourseService,
    private notifyService: NotificationService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.courseService.courseItem$
      .pipe(
        switchMap((course: ICourseItem) => {
          if (course && course.id) {
            this.selectedCourse = course;
            return this.courseService.getAllAvailableUsers(course.id);
          } else {
            return of({ status: false, data: null });
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((res: IHttpResponse) => {
        this.populateUsers(res);
      });
  }

  populateUsers(res: IHttpResponse) {
    if (res.status) {
      this.user = { ...this.user, ...res.data };
      if (
        Array.isArray(res.data.otherUsersAssigned) &&
        res.data.otherUsersAssigned.length > 0
      ) {
        this.user.assignedUsers.push(<any>{
          id: new Date().getTime(),
          name: 'Other Users',
          users: res.data.otherUsersAssigned
        });
      }
      if (
        Array.isArray(res.data.otherUsersAvailable) &&
        res.data.otherUsersAvailable.length > 0
      ) {
        this.user.availableUsers.push(<any>{
          id: 0, //new Date().getTime(),
          name: 'Other Users',
          users: res.data.otherUsersAvailable
        });
      }
      ['availableUsers', 'assignedUsers'].forEach((type: string) => {
        this[type]['dataSource'] = this.userPresenter(this.user[type], type);
      });
    }
  }

  private userPresenter(users, type: string): any[] {
    if (Array.isArray(users)) {
      return users.map(item => {
        let childrens = [];
        if (item.users && Array.isArray(item.users)) {
          childrens = item.users;
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
              this[type]['selected'].push(dealershipUser);
            }
            return dealershipUser;
          })
        };
      });
    } else {
      return [];
    }
  }

  onCourseUserAssigned() {
    const userIDs: any[] = [];
    const selectedAvailableUsers = [];
    if (
      Array.isArray(this.availableUsers.selected) &&
      this.availableUsers.selected.length > 0
    ) {
      this.availableUsers.selected.forEach(item => {
        if (item.parent) {
          userIDs.push({
            user_id: item.value,
            dealership_id: (item.parent && item.parent.value) || 0
          });
          selectedAvailableUsers.push(item);
        }
      });
      if (userIDs.length <= 0) {
        this.notifyService.error(
          'Please select users from below list',
          'Error'
        );
        return;
      }
      const data = { user_id: userIDs, course_id: this.selectedCourse.id };
      this.spinner.show();
      this.courseService
        .addUserOnCourse(data)
        .pipe(
          switchMap((res: IHttpResponse) => {
            this.response = res;
            this.availableUsers.selected = [];
            return this.courseService.getAllAvailableUsers(
              this.selectedCourse.id
            );
          }),
          finalize(() => {
            this.response = null;
            this.availableUsers.selected = [];
            this.spinner.hide();
          }),
          takeUntil(this.destroyed$)
        )
        .subscribe(
          (response: IHttpResponse) => {
            if (response.status) {
              this.notifyService.success(this.response.message, 'Success');
              this.populateUsers(response);
            }
          },
          (err: IHttpResponse) => {
            //this.removeFromUserList('assignedUsers', users);
            //this.updateUserList('availableUsers',users);
            //this.notifyService.error(err && err.message || 'Something went wrong','Error');
          }
        );
    } else {
      this.notifyService.error('Please select users from below list', 'Error');
    }
  }

  onCourseUserUnAssigned() {
    const userIDs: any[] = [];
    const selectedAssignedUsers = [];
    if (
      Array.isArray(this.assignedUsers.selected) &&
      this.assignedUsers.selected.length > 0
    ) {
      this.assignedUsers.selected.forEach(item => {
        if (item.parent) {
          userIDs.push({
            user_id: item.value,
            dealership_id: (item.parent && item.parent.value) || 0
          });
          selectedAssignedUsers.push(item);
        }
      });
      if (userIDs.length <= 0) {
        this.notifyService.error(
          'Please select users from below list',
          'Error'
        );
        return;
      }
      const data = { user_id: userIDs, course_id: this.selectedCourse.id };
      this.updateUserList('availableUsers', selectedAssignedUsers);
      this.spinner.show();
      this.courseService
        .removeUserOnCourse(data)
        .pipe(
          switchMap((res: IHttpResponse) => {
            this.response = res;
            this.assignedUsers.selected = [];
            return this.courseService.getAllAvailableUsers(
              this.selectedCourse.id
            );
          }),
          finalize(() => {
            this.response = null;
            this.assignedUsers.selected = [];
            this.spinner.hide();
          }),
          takeUntil(this.destroyed$)
        )
        .subscribe(
          (response: IHttpResponse) => {
            if (response.status) {
              this.notifyService.success(this.response.message, 'Success');
              this.populateUsers(response);
            }
          },
          (err: IHttpResponse) => {
            //this.removeFromUserList('availableUsers',users);
            //this.updateUserList('assignedUsers',users);
            this.notifyService.error(
              (err && err.message) || 'Something went wrong',
              'Error'
            );
          }
        );
    } else {
      this.notifyService.error('Please select users from below list', 'Error');
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  removeFromUserList(type: 'assignedUsers' | 'availableUsers', items: any[]) {
    //console.log("items",items);
    const foundIndexes = [];
    let index = null;
    if (type === 'assignedUsers') {
      this.user[type].forEach((iteratedUser: IUserAssignedCourse) => {
        index = items.findIndex(
          (item: IUserAssignedCourse) => item.id === iteratedUser.id
        );
        if (index !== -1) {
          console.log('found', iteratedUser);
          foundIndexes.push(index);
        }
      });
    } else if (type === 'availableUsers') {
      this.user[type].forEach((iteratedUser: IUserAvailableCourse) => {
        index = items.findIndex(
          (item: IUserAvailableCourse) => item.id === iteratedUser.id
        );
        foundIndexes.push(index);
      });
    }
    console.log('foundIndexes', foundIndexes);
    foundIndexes.forEach((item: number) => {
      if (item !== -1) {
        console.log('item', item);
        this.user[type].splice(item, 1);
      }
    });
  }

  updateUserList(type: 'assignedUsers' | 'availableUsers', items: any[]) {
    this[type]['selected'].push(...items);
  }

  onCheckAllUsers(className: string) {
    document
      .querySelectorAll('.' + className)
      .forEach((element: HTMLElement) => {
        if (element) {
          element.click();
        }
      });
  }
}
