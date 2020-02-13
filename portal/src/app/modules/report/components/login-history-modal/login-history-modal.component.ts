import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { NotificationService } from '@portal/core/services';

@Component({
  selector: 'lms-login-history-modal',
  templateUrl: './login-history-modal.component.html',
  styleUrls: ['./login-history-modal.component.scss']
})
export class LoginHistoryModalComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  emailDetail: any;
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
