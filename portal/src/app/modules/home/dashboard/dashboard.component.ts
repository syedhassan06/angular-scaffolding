import { IHttpResponse } from '@portal/core/models';
import { Component, OnInit } from '@angular/core';

import { UserService } from '@portal/core/services/user.service';
import { AuthService } from '@portal/core/services';

@Component({
  selector: 'lms-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data = [
    {
      name: 'Germany',
      value: 40632
    },
    {
      name: 'United States',
      value: 49737
    },
    {
      name: 'France',
      value: 36745
    },
    {
      name: 'United Kingdom',
      value: 36240
    },
    {
      name: 'Italy',
      value: 35800
    },
    {
      name: 'Somalia',
      value: 35606
    },
    {
      name: 'Anguilla',
      value: 51491
    },
    {
      name: 'Colombia',
      value: 38601
    }
  ];
  dashboardDataSource = null;
  graphicalDataSource = [];
  constructor(
    public userService: UserService,
    public authService: AuthService
  ) {
    this.fetchDashboardSummary();
  }

  ngOnInit() {}

  fetchDashboardSummary() {
    this.userService
      .getDashboardSummary()
      .subscribe((response: IHttpResponse) => {
        this.dashboardDataSource = response.status ? response.data : null;
        if (
          this.dashboardDataSource &&
          Array.isArray(this.dashboardDataSource.courses)
        ) {
          this.graphicalDataSource = this.dashboardDataSource.courses.map(
            item => ({
              name: item.title,
              value: item.progress
            })
          );
        }
      });
  }

  formatProgress(val) {
    return val + '%';
  }

  formatCourseTitle(val) {
    return typeof val === 'string' && val.slice(0, 5);
  }
}
