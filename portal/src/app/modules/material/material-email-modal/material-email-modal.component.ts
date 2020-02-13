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
import { MaterialService, NotificationService } from '@portal/core/services';
import { takeUntil, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'lms-material-email-modal',
  templateUrl: './material-email-modal.component.html',
  styleUrls: ['./material-email-modal.component.css']
})
export class MaterialEmailModalComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  emailForm: FormGroup;
  title: string;
  closeBtnName: string;
  list: any[] = [];
  emailDetail: any;
  resource: any;
  constructor(
    private spinner: NgxSpinnerService,
    private notifyService: NotificationService,
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private materialService: MaterialService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.fetchResource();
  }

  buildForm() {
    this.emailForm = this.formBuilder.group({
      id: [0, []],
      email_title: ['', [Validators.required]],
      email_description: [''],
      email_date: [],
      send_attachment: [true]
    });
  }

  onSave() {
    if (this.emailForm.valid) {
      const data = { ...this.emailForm.value };
      if (data.email_date && data.email_date instanceof Date) {
        const day = data.email_date.getDate();
        const month = data.email_date.getMonth() + 1; // add 1 because months are indexed from 0
        const year = data.email_date.getFullYear();
        data.email_date = month + '/' + day + '/' + year;
      } else {
        data['log_email_address'] = '';
      }
      //console.log("data",data);
      //return;
      if (!data.id) delete data.id;
      this.savedEmailTemplate(data);
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  savedEmailTemplate(formData: any) {
    this.spinner.show();
    this.materialService
      .addEmailContent(formData, this.resource.id)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(
        (response: IHttpResponse) => {
          if (response.status) {
            this.bsModalRef.hide();
            this.resource.email_title = formData.email_title;
            this.notifyService.success(response.message, 'Success');
            //this.router.navigateByUrl('email-setting');
          } else {
            this.notifyService.error(response.message, 'Error');
          }
        },
        (err: IHttpResponse) => {
          this.notifyService.error(
            (err && err.message) || 'Something went wrong',
            'Error'
          );
        }
      );
  }

  fetchResource() {
    this.materialService
      .getMaterialByID(this.resource.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status && response.data) {
          //this.resource = {...this.resource,...response.data};
          this.emailForm.patchValue(response.data);
        }
      });
  }
}
