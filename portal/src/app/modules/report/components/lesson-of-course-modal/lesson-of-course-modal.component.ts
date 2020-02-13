import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { NotificationService } from '@portal/core/services';

@Component({
  selector: 'lms-lesson-of-course-modal',
  templateUrl: './lesson-of-course-modal.component.html',
  styleUrls: ['./lesson-of-course-modal.component.scss']
})
export class LessonOfCourseModalComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  courseLesson: any = [];
  course: any;
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
