import { Subject } from 'rxjs/Subject';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { STATUS, IDealershipLearner } from '@portal/core/models';
import { ConfirmationService } from '@portal/shared/components/confirm-dialog/confirm-dialog.service';
import { BsModalService } from 'ngx-bootstrap';
import { ScheduleItemModalComponent } from '../schedule-item-modal/schedule-item-modal.component';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from '@portal/core/services';

@Component({
  selector: 'lms-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: [
    './schedule-list.component.scss',
    '../../containers/reports/reports.component.scss'
  ]
})
export class ScheduleListComponent implements OnInit, OnDestroy {
  private _reportData: any[];
  @Input() managers: any = [];
  @Input() dealershipedLearners: IDealershipLearner[] = [];
  @Input()
  set reportData(data) {
    this._reportData = data;
  }
  get reportData() {
    return this._reportData;
  }
  @Output() delete$ = new EventEmitter<any>();
  @Output() save$ = new EventEmitter<string>();
  private readonly destroyed$ = new Subject<void>();
  selectedSchedule: any = null;
  scheduleModalRef = null;
  tableFilters = ['schedule_title', 'email'];
  cols = [
    {
      field: 'schedule_title',
      header: 'Schedule Title',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains'
    },
    {
      field: 'get_report_of',
      header: 'Report Of',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains',
      sortable: true
    },
    {
      field: 'send_report_to',
      header: 'Send Report To',
      filterType: 'input',
      filter: true,
      filterMatchMode: 'contains',
      sortable: true
    },
    {
      field: 'last_run_at',
      header: 'Last Run At',
      filter: true,
      filterType: 'date',
      filterMatchMode: 'contains',
      sortable: true
    },
    {
      field: 'next_run_at',
      header: 'Next Run At',
      filter: true,
      filterType: 'date',
      filterMatchMode: 'contains',
      sortable: true
    },
    {
      field: 'description',
      header: 'Description'
    },
    {
      header: 'Action'
    }
  ];

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

  onOpenConfirmModal(schedule: any): void {
    this.selectedSchedule = schedule;
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
    this.delete$.emit(this.selectedSchedule);
  }

  handleChange(event, item, field) {
    item[field] = event.checked;
    this.save$.emit(item);
  }

  onClickScheduleItem(schedule = null) {
    const initialState = {
      selectedSchedule: null,
      managerList: this.managers,
      dealershipedLearners: this.dealershipedLearners
    };
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl'
    };
    if (schedule) {
      initialState['selectedSchedule'] = schedule;
    }
    this.scheduleModalRef = this.bsModalService.show(
      ScheduleItemModalComponent,
      {
        initialState,
        ...config
      }
    );
  }
}
