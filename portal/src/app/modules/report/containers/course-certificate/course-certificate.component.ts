import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IHttpResponse, ICourseStats } from '@portal/core/models';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { ReportService } from '@portal/core/services';
import { takeUntil, finalize } from 'rxjs/operators';
@Component({
  selector: 'lms-course-certificate',
  templateUrl: './course-certificate.component.html',
  styleUrls: ['./course-certificate.component.scss']
})
export class CourseCertificateComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  courses: any[] = [];
  tableFilters = ['title', 'email'];
  selectedCourse: ICourseStats;
  cols = [
    {
      field: 'title',
      header: 'Course',
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
      field: 'first_name',
      header: 'First Name',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'last_name',
      header: 'Last Name',
      filterType: 'input',
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
      field: 'certificate_expiration_date',
      header: 'Exp. Date',
      filterType: 'date',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      header: 'Action'
    }
  ];

  constructor(
    private loadingPlaceholderService: LoadingPlaceholderService,
    private reportService: ReportService
  ) {
    this.loadingPlaceholderService.show();
  }

  ngOnInit() {
    this.fetchAll();
  }

  fetchAll(): void {
    this.reportService
      .getAllCourseCertificate()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.loadingPlaceholderService.hide())
      )
      .subscribe((response: IHttpResponse) => {
        this.courses = response.status ? response.data : [];
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onResetPDF(event) {
    this.selectedCourse = null;
  }

  generateCertificate(course: ICourseStats) {
    this.selectedCourse = course;
  }
}
