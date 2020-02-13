import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ɵConsole
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil, finalize } from 'rxjs/operators';
import {
  DealershipService,
  CourseService,
  ReportService
} from '@portal/core/services';
import { ICourseItem } from '@portal/core/models/course.model';
import { IDealerGroup, IHttpResponse, IDealer } from '@portal/core/models';
import { NgxSpinnerService } from 'ngx-spinner';
import { deepCopy } from '@portal/shared/utils/helper';

@Component({
  selector: 'lms-report-card',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './report-card.component.html',
  styleUrls: [
    './report-card.component.scss',
    '../reports/reports.component.scss'
  ]
})
export class ReportCardComponent implements OnInit, OnDestroy {
  filter = {
    dealergroup: { value: null, placeholder: 'Select Dealergroup' },
    dealership: { value: null, placeholder: 'Select Dealership' },
    course: { value: null, placeholder: 'Select Course' },
    fromDate: { value: undefined, placeholder: '' },
    toDate: { value: undefined, placeholder: '' }
  };
  fromDate;
  toDate;
  dealergroups: IDealerGroup[] = [];
  dealerships: IDealer[] = [];
  dealershipsSource: IDealer[] = [];
  courses: ICourseItem[] = [];
  dataSource = [];
  reportTitle = {
    main: { text: '' },
    subMain: { text: '' },
    subMainV2: { text: '' },
    subMainV3: { text: '' },
    name: 'report-card'
  };
  cols = [
    {
      field: 'name',
      header: 'Name',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'title',
      header: 'Course',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'progress',
      header: 'Progress'
    },
    {
      field: 'registration_date',
      header: 'Reg. Date',
      filter: true,
      filterType: 'date',
      filterMatchMode: 'contains'
    },
    {
      field: 'starting_date',
      header: 'Start Date',
      filter: true,
      filterType: 'date',
      filterMatchMode: 'contains'
    },
    {
      field: 'completion_date',
      header: 'Completion Date',
      filter: true,
      filterType: 'date',
      filterMatchMode: 'contains'
    },
    {
      field: 'certificate_expiration_date',
      header: 'Certificate Exp. Date',
      filter: true,
      filterType: 'date',
      filterMatchMode: 'contains'
    },
    {
      field: 'expiration_date',
      header: 'Exp. Date',
      filter: true,
      filterType: 'date',
      filterMatchMode: 'contains'
    },
    { field: 'no_of_logins', header: 'No. Of Logins' }
  ];
  private readonly destroyed$ = new Subject<void>();
  constructor(
    private dealershipService: DealershipService,
    private courseService: CourseService,
    private reportService: ReportService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.fetchAllDealergroups();
    this.fetchAllDealerships();
  }

  onChangeDealergroup() {
    if (this.filter.dealergroup.value) {
      this.fetchDealershipByDealergroupID(this.filter.dealergroup.value.id);
      this.reportTitle.main.text =
        'Dealergroup:   ' + this.filter.dealergroup.value.name;
    } else {
      this.dealerships = deepCopy(this.dealershipsSource);
      this.filter.dealership.value = null;
      this.filter.dealergroup.value = null;
    }
  }

  onChangeDealership() {
    const dealerNames = this.filter.dealership.value.map(item => item.name);
    const dealerIDs = this.filter.dealership.value.map(item => item.id);
    if (this.filter.dealership.value) {
      this.reportTitle.subMain.text =
        'Dealership:     ' + dealerNames.join(', ');
      this.fetchAllCoursesByDealership(dealerIDs);
    }
  }

  onChangeCourse() {
    if (this.filter.course.value) {
      this.reportTitle.subMainV2.text =
        'Course:   ' + this.filter.course.value.title;
    }
  }

  onChangeDate() {
    if (this.filter.fromDate) {
      this.reportTitle.subMainV3.text =
        'Date:   ' + this.getDate(this.filter.fromDate.value, 'm/d/y');
    }
    if (this.filter.fromDate && this.filter.toDate) {
      this.reportTitle.subMainV3.text +=
        '  to  ' + this.getDate(this.filter.toDate.value, 'm/d/y');
    }
  }

  fetchAllDealergroups(): void {
    this.dealershipService
      .getAllGroups()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        this.dealergroups = response.status ? response.data : [];
      });
  }

  fetchAllDealerships() {
    this.dealershipService
      .getAllDealers()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        this.dealershipsSource = deepCopy(response.data);
        this.dealerships = response.status ? response.data : [];
      });
  }

  fetchDealershipByDealergroupID(id): void {
    this.dealershipService
      .getDealerByDealerGroup(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        this.dealerships = [];
        this.dealerships = response.status ? response.data : [];
        this.filter.dealership.value = null;
        this.courses = [];
      });
  }

  fetchAllCoursesByDealership(ids = []) {
    if (ids.length <= 0) {
      this.courses = [];
      return;
    }
    this.courseService
      .getCourseByDealershipID(ids)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        this.courses = [];
        if (response.status) {
          Object.keys(response.data).forEach(indexKey => {
            this.courses.push(response.data[indexKey]);
          });
        } else {
          this.dataSource = [];
        }
        //this.courses = response.status ? response.data : [];
      });
  }

  onGenerateReport() {
    this.spinner.show();
    const data = {
      dealership_id:
        (Array.isArray(this.filter.dealership.value) &&
          this.filter.dealership.value.map(item => item.id).join(',')) ||
        []
    };
    if (this.filter.dealergroup.value && this.filter.dealergroup.value.id)
      data['dealergroup_id'] = this.filter.dealergroup.value.id;
    if (this.filter.course.value)
      data['course_id'] = this.filter.course.value.id;
    if (this.filter.fromDate.value)
      data['from_date'] = this.getDate(this.filter.fromDate.value);
    if (this.filter.fromDate.value)
      data['to_date'] = this.getDate(this.filter.toDate.value);
    this.reportService
      .getReportCard(data)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe((response: IHttpResponse) => {
        this.dataSource = response.status ? response.data : [];
      });
  }

  getDate(date, format = 'y-m-d') {
    let data = '';
    if (date && date instanceof Date) {
      const day = date.getDate();
      const month = date.getMonth() + 1; // add 1 because months are indexed from 0
      const year = date.getFullYear();
      data =
        format === 'y-m-d'
          ? year + '-' + month + '-' + day
          : month + '-' + day + '-' + year;
    }
    return data;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
