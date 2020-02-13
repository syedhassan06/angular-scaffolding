import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { NotificationService } from '@portal/core/services';

@Component({
  selector: 'lms-user-course-modal',
  templateUrl: './user-course-modal.component.html',
  styleUrls: ['./user-course-modal.component.scss']
})
export class UserCourseModalComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  emailDetail: any;
  userCourse: any = [];
  user: any;
  constructor(
    private notifyService: NotificationService,
    public bsModalRef: BsModalRef
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
