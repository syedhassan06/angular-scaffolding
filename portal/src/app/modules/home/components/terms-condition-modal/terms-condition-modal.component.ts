import { Subject } from 'rxjs/Subject';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { IAction, IHttpResponse } from '@portal/core/models';
import { BsModalRef } from 'ngx-bootstrap';
import { SettingsService, NotificationService } from '@portal/core/services';
import { takeUntil, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'lms-terms-condition-modal',
  templateUrl: './terms-condition-modal.component.html',
  styleUrls: ['./terms-condition-modal.component.css']
})
export class TermsConditionModalComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  termsConditionDetail: any = null;
  is_agree = false;
  toggleCheckbox = false;
  disabled = false;

  constructor(
    private spinner: NgxSpinnerService,
    private notifyService: NotificationService,
    public bsModalRef: BsModalRef,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    if (this.termsConditionDetail) {
      this.toggleCheckbox = this.termsConditionDetail.checked;
    }
  }

  onCheckedTerms() {
    if (this.is_agree) {
      this.spinner.show();
      this.settingsService
        .agreeTermsCondition()
        .pipe(
          finalize(() => {
            this.spinner.hide();
          }),
          takeUntil(this.destroyed$)
        )
        .subscribe((response: any) => {
          if (response && response.status) {
            this.toggleCheckbox = true;
            this.disabled = false;
            this.bsModalRef.hide();
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
