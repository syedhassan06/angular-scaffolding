import { CourseService } from '@portal/core/services/course.service';
import { Subject } from 'rxjs/Subject';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  forwardRef,
  ViewEncapsulation
} from '@angular/core';
import { takeUntil, finalize } from 'rxjs/operators';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { CertificateComponent } from './../components/certificate/certificate.component';
import { ICourseStats } from '@portal/core/models/course.model';
import { getProgressList } from '@portal/shared/utils/helper';

@Component({
  selector: 'lms-course',
  templateUrl: './course.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {
  courses = [];
  selectedCourse: ICourseStats;
  isPrint = false;
  tableFilters = ['title'];
  private readonly destroyed$ = new Subject<void>();
  @ViewChild(forwardRef(() => CertificateComponent)) certificateComponent;
  cols = [
    {
      field: 'title',
      header: 'Course',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },

    {
      field: 'status',
      header: 'Status',
      filterType: 'select',
      filter: true,
      options: getProgressList(),
      filterMatchMode: 'contains'
    },
    {
      field: 'progress',
      header: 'Progress'
    },
    {
      field: 'registration_date',
      header: 'Reg. Date',
      filterType: 'date',
      filter: true,
      filterMatchMode: 'contains'
    },

    {
      field: 'starting_date',
      header: 'Start Date',
      filterType: 'date',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'completion_date',
      header: 'Completion Date',
      filterType: 'date',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'expiration_date',
      header: 'Expiration Date',
      filterType: 'date',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'certificate_expiration_date',
      header: 'Certificate Expiration',
      filterType: 'date',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      header: 'Action'
    }
  ];

  constructor(
    private courseService: CourseService,
    private loadingPlaceholderService: LoadingPlaceholderService
  ) {
    this.loadingPlaceholderService.show();
    this.fetchReport();
  }

  ngOnInit() {}

  fetchReport() {
    this.courseService
      .getReport()
      .pipe(
        finalize(() => this.loadingPlaceholderService.hide()),
        takeUntil(this.destroyed$)
      )
      .subscribe(response => {
        if (response.status) {
          this.courses = response.data;
        } else {
          this.courses = [];
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  generateCertificate(course: ICourseStats) {
    this.selectedCourse = course;
    //this.certificateComponent.generatePdf();
  }

  onResetPDF(event) {
    this.selectedCourse = null;
  }
}
