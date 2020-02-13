import { Subject } from 'rxjs/Subject';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { STATUS, IAssignment } from '@portal/core/models';
import { ConfirmationService } from '@portal/shared/components/confirm-dialog/confirm-dialog.service';
import { BsModalService } from 'ngx-bootstrap';
import { AssignmentModalComponent } from './../assignment-modal/assignment-modal.component';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from '@portal/core/services';

@Component({
  selector: 'lms-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.scss']
})
export class AssignmentListComponent implements OnInit, OnDestroy {
  @Input() assignments: IAssignment[] = [];
  @Output() delete$ = new EventEmitter<any>();
  @Output() edit$ = new EventEmitter<any>();
  @Output() save$ = new EventEmitter<string>();
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private confirmService: ConfirmationService,
    private bsModalService: BsModalService,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.subscribeOnCloseModal();
  }

  subscribeOnCloseModal() {
    this.bsModalService.onHide
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.reportService.saveScheduleEmitter.next(false);
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onEditAssignment(assignment = null) {
    this.edit$.emit(assignment);
  }

  onOpenConfirmModal(deleteAssignment = {}): void {
    this.confirmService.confirm(
      {
        title: 'Confirmation',
        content: 'Are you sure you want to delete',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes'
      },
      () => {
        this.deleteAssignment(deleteAssignment);
      },
      () => {}
    );
  }

  deleteAssignment(assignment = null) {
    this.delete$.emit(assignment);
  }
}
