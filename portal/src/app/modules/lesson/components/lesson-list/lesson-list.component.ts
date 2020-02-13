import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ILesson } from '@portal/core/models';
import { ConfirmationService } from '@portal/shared/components/confirm-dialog/confirm-dialog.service';
import { LessonContentModalComponent } from '@portal/shared/components/lesson-content-modal/lesson-content-modal.component';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'lms-lesson-list',
  templateUrl: './lesson-list.component.html',
  styleUrls: ['./lesson-list.component.css']
})
export class LessonListComponent implements OnInit {
  @Input() lessons: ILesson[] = [];
  @Output() delete$ = new EventEmitter<ILesson>();
  selectedLesson: ILesson = null;
  tableFilters = ['title'];
  cols = [
    {
      field: 'title',
      header: 'Title',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      header: 'Action'
    }
  ];

  constructor(
    private confirmService: ConfirmationService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {}

  onOpenConfirmModal(dealer: ILesson): void {
    this.selectedLesson = dealer;
    this.confirmService.confirm(
      {
        title: 'Confirmation',
        content: 'Are you sure you want to delete',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes'
      },
      () => {
        this.deleteLesson();
      },
      () => {}
    );
  }

  deleteLesson() {
    this.delete$.emit(this.selectedLesson);
  }

  shownLessonContent(lesson) {
    const initialState = {
      selectedResource: lesson
    };
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl'
    };
    this.modalService.show(LessonContentModalComponent, {
      initialState,
      ...config
    });
  }
}
