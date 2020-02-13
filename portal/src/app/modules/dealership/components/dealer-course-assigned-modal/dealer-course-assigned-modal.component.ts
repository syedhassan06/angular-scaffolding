import { BsModalRef } from 'ngx-bootstrap/modal';
import { ICourseItem } from './../../../../core/models/course.model';
import { NotificationService, DealershipService } from '@portal/core/services';
import { IDealer } from '@portal/core/models/dealership.model';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap, takeUntil, finalize } from 'rxjs/operators';
import { IHttpResponse } from '@portal/core/models';

interface IDealershipAssignedCourse {
  availableCourses: ICourseItem[];
  assignedCourses: ICourseItem[];
}

@Component({
  selector: 'lms-dealer-course-assigned-modal',
  templateUrl: './dealer-course-assigned-modal.component.html',
  styleUrls: ['./dealer-course-assigned-modal.component.scss']
})
export class DealerCourseAssignedModalComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  course: IDealershipAssignedCourse = {
    availableCourses: [],
    assignedCourses: []
  };
  selectedDealership: IDealer = null;
  data = {
    source: [],
    target: []
  };
  availableCourses = { dataSource: [], selected: [] };
  assignedCourses = { dataSource: [], selected: [] };
  response = null;
  constructor(
    private dealershipService: DealershipService,
    private notifyService: NotificationService,
    private spinner: NgxSpinnerService,
    public bsModalRef: BsModalRef
  ) {}

  ngOnInit() {
    this.dealershipService
      .getAllDealershipCourses(this.selectedDealership.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res: IHttpResponse) => {
        this.populateCourses(res);
      });
  }

  populateCourses(res: IHttpResponse) {
    if (res.status) {
      this.course = { ...this.course, ...res.data };
      ['availableCourses', 'assignedCourses'].forEach((type: string) => {
        this[type]['dataSource'] = this.coursePresenter(
          this.course[type],
          type
        );
      });
    }
  }

  private coursePresenter(courses: ICourseItem[], type: string): any[] {
    if (Array.isArray(courses)) {
      return courses.map(item => {
        return {
          label: `${item.title}`,
          value: item.id
        };
      });
    } else {
      return [];
    }
  }

  onCourseUserAssigned() {
    const courseIDs: any[] = [];
    const selectedAvailableCourses = [];
    if (
      Array.isArray(this.availableCourses.selected) &&
      this.availableCourses.selected.length > 0
    ) {
      this.availableCourses.selected.forEach(item => {
        if (item.value) {
          courseIDs.push(item.value);
          selectedAvailableCourses.push(item);
        }
      });
      if (courseIDs.length <= 0) {
        this.notifyService.error(
          'Please select courses from below list',
          'Error'
        );
        return;
      }
      const data = {
        course_id: courseIDs,
        dealership_id: this.selectedDealership.id
      };
      this.spinner.show();
      this.dealershipService
        .addDealerOnCourse(data)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          }),
          takeUntil(this.destroyed$)
        )
        .subscribe(
          (response: IHttpResponse) => {
            if (response.status) {
              this.response = response;
              this.updateUserList('assignedCourses', selectedAvailableCourses);
            } else {
              this.notifyService.error(
                (response && response.message) || 'Something went wrong',
                'Error'
              );
            }
          },
          (err: IHttpResponse) => {
            this.notifyService.error(
              (err && err.message) || 'Something went wrong',
              'Error'
            );
          }
        );
    } else {
      this.notifyService.error(
        'Please select courses from below list',
        'Error'
      );
    }
  }

  onCourseUserUnAssigned() {
    const courseIDs: any[] = [];
    const selectedAssignedCourses = [];
    if (
      Array.isArray(this.assignedCourses.selected) &&
      this.assignedCourses.selected.length > 0
    ) {
      this.assignedCourses.selected.forEach(item => {
        if (item.value) {
          courseIDs.push(item.value);
          selectedAssignedCourses.push(item);
        }
      });
      if (courseIDs.length <= 0) {
        this.notifyService.error(
          'Please select users from below list',
          'Error'
        );
        return;
      }
      const data = {
        course_id: courseIDs,
        dealership_id: this.selectedDealership.id
      };
      this.spinner.show();
      this.dealershipService
        .removeDealerFromCourse(data)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          }),
          takeUntil(this.destroyed$)
        )
        .subscribe(
          (response: IHttpResponse) => {
            if (response.status) {
              this.response = response;
              this.updateUserList('availableCourses', selectedAssignedCourses);
            } else {
              this.notifyService.error(
                (response && response.message) || 'Something went wrong',
                'Error'
              );
            }
          },
          (err: IHttpResponse) => {
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

  removeFromUserList(type: 'assignedCourses' | 'availableCourses') {
    const foundIndexes = [];
    let index = null;
    let itemsCounter = 0;
    if (type === 'assignedCourses') {
      this.assignedCourses.selected.forEach(iteratedCourse => {
        index = this.assignedCourses.dataSource.findIndex(
          item => item.value === iteratedCourse.value
        );
        if (index !== -1) foundIndexes.push(index);
        index = null;
      });
    } else if (type === 'availableCourses') {
      this.availableCourses.selected.forEach(iteratedCourse => {
        index = this.availableCourses.dataSource.findIndex(
          item => item.value === iteratedCourse.value
        );
        if (index !== -1) foundIndexes.push(index);
        index = null;
      });
    }
    foundIndexes.forEach((item: number) => {
      if (item !== -1) {
        this[type]['dataSource'].splice(item - itemsCounter, 1);
        itemsCounter += 1;
      }
    });
  }

  updateUserList(type: 'assignedCourses' | 'availableCourses', items: any[]) {
    this[type]['dataSource'].push(...items);
    if (type === 'assignedCourses') {
      this.removeFromUserList('availableCourses');
      this.availableCourses.selected = [];
      (<HTMLInputElement>(
        document.getElementById('select-available-dealer')
      )).checked = false;
    } else if (type === 'availableCourses') {
      this.removeFromUserList('assignedCourses');
      this.assignedCourses.selected = [];

      (<HTMLInputElement>(
        document.getElementById('select-assigned-dealer')
      )).checked = false;
    }
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
