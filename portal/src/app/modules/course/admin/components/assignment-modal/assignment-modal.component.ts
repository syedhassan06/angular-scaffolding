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

enum RESOURCE_OPTIONS {
  'none' = 0,
  'uploaded' = 1,
  'new' = 2
}

@Component({
  selector: 'lms-assignment-modal',
  templateUrl: './assignment-modal.component.html',
  styleUrls: ['./assignment-modal.component.scss']
})
export class AssignmentModalComponent implements OnInit, OnDestroy {
  resources = [];
  assignments: IAssignment[] = [];
  private readonly destroyed$ = new Subject<void>();
  resourceOptions = RESOURCE_OPTIONS;
  assignmentForm: FormGroup;
  action: IAction = 'add';
  page = {
    add: { title: 'New Assignment' },
    edit: { title: 'Edit Assignment' }
  };
  selectedCourseID = null;
  selectedAssignment: {
    resource_id: string;
    title: string;
    description: string;
    total_marks: string;
    passing_marks: string;
    status: string;
  };
  fileResource: File = null;

  constructor(
    public modalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private spinner: NgxSpinnerService,
    private notifyService: NotificationService
  ) {}

  ngOnInit() {
    this.buildForm();
    if (this.selectedAssignment) {
      this.assignmentForm.patchValue(this.selectedAssignment);
      this.action = 'edit';
      this.populateResource();
    }
    //this.onWatchResourceValidation();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  buildForm() {
    this.assignmentForm = this.formBuilder.group({
      id: [0, []],
      course_id: [this.selectedCourseID, []],
      resource_option: [0, [Validators.required]],
      title: ['', [Validators.required]],
      resource_id: ['', []],
      description: ['', [Validators.required]],
      resource_file: [null],
      total_marks: [null, []],
      passing_marks: [null, []]
    });
  }

  populateResource() {
    if (this.selectedAssignment && this.selectedAssignment.resource_id) {
      this.assignmentForm.get('resource_option').setValue(1);
      if (this.resources && this.resources.length > 0) {
        const resource = this.resources.find(item => {
          return item.id == this.selectedAssignment.resource_id;
        });
        setTimeout(() => {
          this.assignmentForm.get('resource_id').setValue(resource);
        }, 1000);
      }
    }
  }

  onChangeResourceFile(inputElement: HTMLInputElement) {
    if (inputElement.files && inputElement.files.length > 0) {
      this.fileResource = inputElement.files[0];
    } else {
      this.fileResource = null;
    }
    this.assignmentForm.get('resource_file').setValue(this.fileResource);
  }

  onWatchResourceValidation() {
    this.assignmentForm
      .get('resource_option')
      .valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe(val => {
        console.log('val', val == 1);
        const resourceIdControl = this.assignmentForm.get('resource_id');
        console.log('resourceIdControl', resourceIdControl);
        //const resource_file =  this.assignmentForm.get('resource_id');
        if (val == 1) {
          this.assignmentForm
            .get('resource_id')
            .setValidators(Validators.required);
        } else {
          this.assignmentForm.get('resource_id').reset();
          this.assignmentForm.get('resource_id').setValidators(null);
        }
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
    let payload: any = {};
    if (this.assignmentForm.valid) {
      const assignmentFormValues = this.assignmentForm.value;
      payload = {
        ...assignmentFormValues
      };
      payload.total_marks = payload.total_marks || 0;
      payload.passing_marks = payload.passing_marks || 0;

      if (payload.resource_option != 1) {
        delete payload['resource_id'];
      } else {
        if (payload.resource_id) {
          payload.resource_id = payload.resource_id.id;
        }
      }

      if (assignmentFormValues.id) payload['id'] = assignmentFormValues.id;

      if (payload.resource_option == 2 && payload.resource_file) {
        const payloadFormDataInstance = new FormData();
        Object.keys(payload).forEach(assocIndex => {
          payloadFormDataInstance.append(assocIndex, payload[assocIndex]);
        });
        console.log('payloadFormDataInstance', payloadFormDataInstance);
        payload = payloadFormDataInstance;
      }

      this.spinner.show();
      this.courseService
        .saveAssignmentToCourse(payload)
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
              if (payload.id) {
                const selectedAssignmentIndex = this.assignments.findIndex(
                  item => item.id === payload.id
                );
                this.assignments.splice(selectedAssignmentIndex, 1);
              }
              this.assignments.push(response.data);

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
