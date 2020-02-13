import { CourseService } from '@portal/core/services';
import { Subject } from 'rxjs/Subject';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { STATUS, ISubmittedAssignment } from '@portal/core/models';
import { ConfirmationService } from '@portal/shared/components/confirm-dialog/confirm-dialog.service';
import { BsModalService } from 'ngx-bootstrap';
import { AssignmentGradingModalComponent } from './../assignment-grading-modal/assignment-grading-modal.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'lms-submitted-assignment-list',
  templateUrl: './submitted-assignment-list.component.html',
  styleUrls: ['./submitted-assignment-list.component.scss']
})
export class SubmittedAssignmentListComponent implements OnInit, OnDestroy {
  private _submittedAssignments: ISubmittedAssignment[];
  @Input()
  set submittedAssignments(data) {
    this._submittedAssignments = data;
  }
  get submittedAssignments() {
    return this._submittedAssignments;
  }
  @Output() delete$ = new EventEmitter<any>();
  @Output() save$ = new EventEmitter<string>();
  private readonly destroyed$ = new Subject<void>();
  selectedSubmittedAssignment: any = null;
  assignmentGradingModalRef = null;
  tableFilters = ['title', 'first_name', 'email'];
  cols = [
    {
      field: 'title',
      header: 'Assignment',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'name',
      header: 'Name',
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
      field: 'submitted_at',
      header: 'Submiited At',
      filter: true,
      filterType: 'date',
      filterMatchMode: 'contains',
      sortable: true
    },
    {
      header: 'Action'
    }
  ];

  constructor(
    private confirmService: ConfirmationService,
    private courseService: CourseService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onOpenConfirmModal(assignment: any): void {
    this.selectedSubmittedAssignment = assignment;
    this.confirmService.confirm(
      {
        title: 'Confirmation',
        content: 'Are you sure you want to delete',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes'
      },
      () => {
        this.deleteSchedule();
      },
      () => {}
    );
  }

  deleteSchedule() {
    this.delete$.emit(this.selectedSubmittedAssignment);
  }

  onDownloadFile(assignment: ISubmittedAssignment, $event) {
    //3lLc8vC4nzgXmrCJKXcZG6vo9TAtA6fGppI4Bs45.pdf
    const anchorElement = document.createElement('a');
    anchorElement.href = '/secure-files/' + assignment.submitted_file_path;
    anchorElement.download = '';
    anchorElement.click();
    anchorElement.remove();
  }

  onShownGradingAssignment(assignment: ISubmittedAssignment = null) {
    const initialState = {
      selectedSubmittedAssignment: assignment
    };
    const config = {
      backdrop: true,
      ignoreBackdropClick: true
      //class : 'modal-lg'
    };
    this.courseService
      .assignmentGrading({ id: assignment.id })
      .subscribe(res => {
        if (res.status) {
          initialState['selectedGradingAssignemnt'] = res.data;
        }
        this.assignmentGradingModalRef = this.modalService.show(
          AssignmentGradingModalComponent,
          {
            initialState,
            ...config
          }
        );
      });
  }
}
