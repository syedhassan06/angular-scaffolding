import { ISubmittedAssignment } from './../../../../../core/models/course.model';
import { finalize, takeUntil } from 'rxjs/operators';
import { CourseService } from './../../../../../core/services/course.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl
} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { IAction, IHttpResponse, IAssignment } from '@portal/core/models';
import { NotificationService } from '@portal/core/services';

@Component({
  selector: 'lms-assignment-grading-modal',
  templateUrl: './assignment-grading-modal.component.html',
  styleUrls: ['./assignment-grading-modal.component.scss']
})
export class AssignmentGradingModalComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  assignmentForm: FormGroup;
  action: IAction = 'add';
  selectedSubmittedAssignment: ISubmittedAssignment;
  selectedGradingAssignemnt;

  constructor(
    public modalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private spinner: NgxSpinnerService,
    private notifyService: NotificationService
  ) {}

  ngOnInit() {
    this.buildForm();
    if (this.selectedGradingAssignemnt) {
      this.assignmentForm.patchValue({
        ...this.selectedGradingAssignemnt,
        ...{ action: 'update' }
      });
      //this.action = 'edit';
    }
    //this.onWatchResourceValidation();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  buildForm() {
    this.assignmentForm = this.formBuilder.group({
      marks_obtained: ['', [Validators.required]],
      grade: ['', [Validators.required]],
      comments: [''],
      action: [''],
      status: [''],
      id: [this.selectedSubmittedAssignment.id]
    });
  }

  onSave() {
    this.markFormGroupTouched(this.assignmentForm);
    //console.log(this.assignmentForm.valid);
    //console.log(this.fileResource.nativeElement.files[0].name);
    // this.markFormGroupTouched(this.assignmentForm);
    // this.assignments.push({id:2,name:'Assignment-02'});
    // this.modalRef.hide();
    // return;
    const payload = {
      ...this.assignmentForm.value
    };
    if (this.assignmentForm.valid) {
      this.spinner.show();
      this.courseService
        .assignmentGrading(payload)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          }),
          takeUntil(this.destroyed$)
        )
        .subscribe(
          (response: IHttpResponse) => {
            if (response.status) {
              this.modalRef.hide();
              this.notifyService.success(response.message, 'Success');
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
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
