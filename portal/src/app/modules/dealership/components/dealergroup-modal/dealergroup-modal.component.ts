import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { NotificationService } from '@portal/core/services';

@Component({
  selector: 'lms-dealergroup-modal',
  templateUrl: './dealergroup-modal.component.html',
  styleUrls: ['./dealergroup-modal.component.scss']
})
export class DealergroupModalComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  dealerships: any = [];
  dealergroup: any;
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
