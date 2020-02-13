import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IHttpResponse, ILesson } from '@portal/core/models';
import { LessonService, NotificationService } from '@portal/core/services';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { deepCopy } from '@portal/shared/utils/helper';

@Component({
  selector: 'lms-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  lessons: ILesson[] = [];

  constructor(
    private loadingPlaceholderService: LoadingPlaceholderService,
    private notifyService: NotificationService,
    private lessonService: LessonService
  ) {}

  ngOnInit() {
    this.fetchAll();
  }

  fetchAll(): void {
    this.lessonService
      .getAllLessons()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.loadingPlaceholderService.hide())
      )
      .subscribe((response: IHttpResponse) => {
        this.lessons = response.status ? response.data : [];
      });
  }

  deleteLesson(dealer: ILesson) {
    const updatedLessons = deepCopy(this.lessons);
    this.lessonService
      .deleteLesson(dealer.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            const index: number = updatedLessons.findIndex(
              (iteratedResource: any) => {
                return iteratedResource.id === dealer.id;
              }
            );
            updatedLessons.splice(index, 1);
            this.lessons = updatedLessons;
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

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
