import { CourseService } from '@portal/core/services/course.service';
import {
  IHttpResponse,
  IAssignment,
  ISubmittedAssignment
} from '@portal/core/models';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NotificationService } from '@portal/core/services';
import { slideUpDown } from '@portal/shared/utils/animate';
import { deepCopy } from '@portal/shared/utils/helper';

@Component({
  selector: 'lms-learner-assignment',
  templateUrl: './learner-assignment.component.html',
  styleUrls: ['./learner-assignment.component.scss'],
  animations: [slideUpDown]
})
export class LearnerAssignmentComponent implements OnInit, OnDestroy {
  @Input()
  set allAssignments(_assignment: IAssignment[]) {
    this.assignmentsDataPresenter(_assignment);
  }
  @Input() course;
  assignments = { submitted: [], due: [] };
  assignmentQue = [];
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private courseService: CourseService,
    private notifyService: NotificationService
  ) {}

  ngOnInit() {}

  assignmentsDataPresenter(assignments: IAssignment[]) {
    this.assignments.due = assignments;
  }

  onAddedAssignmentQue(event: Event, assignment) {
    const fileElement = <HTMLInputElement>event.target;
    if (fileElement && fileElement.files && fileElement.files.length > 0) {
      const foundAssginment = this.assignmentQue.find(
        item => item.assignment_id === assignment.id
      );
      if (foundAssginment) {
        foundAssginment.assignment_file = fileElement.files[0];
        foundAssginment.element = fileElement;
      } else {
        this.assignmentQue = [
          ...this.assignmentQue,
          {
            assignment_file: fileElement.files[0],
            assignment_id: assignment.id,
            element: fileElement
          }
        ];
        // this.assignmentQue.push({
        //   assignment_file: fileElement.files[0],
        //   assignment_id: assignment.id,
        //   element: fileElement
        // });
      }
    } else {
      this.onRemoveAssignmentSubmission(assignment);
    }
    //console.log("this.assignmentQue", this.assignmentQue)
    //console.log("event", event)
  }

  assignmentSubmittedFile(assignment) {
    if (assignment) {
      const foundAssginment = this.assignmentQue.find(
        item => item.assignment_id === assignment.id
      );
      return foundAssginment || null;
    }
  }

  onRemoveAssignmentSubmission(assignment) {
    const allSelectedUploadAssignments = [...this.assignmentQue];
    const assignmentIndex = this.assignmentQue.findIndex(
      item => item.assignment_id === assignment.id
    );
    (<HTMLInputElement>this.assignmentQue[assignmentIndex]['element']).value =
      '';
    allSelectedUploadAssignments.splice(assignmentIndex, 1);
    this.assignmentQue = [...allSelectedUploadAssignments];
  }

  onAssignmentSubmit(assignment) {
    if (assignment) {
      const foundAssginment = this.assignmentQue.find(
        item => item.assignment_id === assignment.id
      );
      foundAssginment['user_course_id'] = this.course.user_course_id;

      const formDataInstance = new FormData();
      Object.keys(foundAssginment).forEach(assocIndex => {
        if (assocIndex !== 'element')
          formDataInstance.append(assocIndex, foundAssginment[assocIndex]);
      });

      this.courseService
        .learnerAssignmentSubmission(formDataInstance)
        .subscribe(res => {
          if (res.status) {
            this.onRemoveAssignmentSubmission(assignment);
            this.notifyService.success(res.message, 'Success');
            assignment.submitted_assignment = [res.data];
          }
        });
    }
  }

  onDownloadFile(file: string) {
    const anchorElement = document.createElement('a');
    anchorElement.href = '/secure-files/' + file;
    anchorElement.download = '';
    anchorElement.click();
    anchorElement.remove();
  }

  onToggleComments(assignment) {
    assignment['showComments'] = !assignment['showComments'];
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
