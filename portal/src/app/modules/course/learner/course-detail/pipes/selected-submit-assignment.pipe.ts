import { Pipe, PipeTransform } from '@angular/core';
import { IAssignment } from '@portal/core/models';

interface IUploadedAssignment {
  assignment_file: File;
  assignment_id: number;
  element: HTMLInputElement;
}

@Pipe({
  name: 'selectedSubmitAssignment'
})
export class SelectedSubmitAssignmentPipe implements PipeTransform {
  transform(
    assignmentQue: IUploadedAssignment[] = [],
    assignment: IAssignment
  ): any {
    if (assignment) {
      const foundAssginment = assignmentQue.find(
        item => item.assignment_id === assignment.id
      );
      //console.log("foundAssginment",foundAssginment);
      return foundAssginment || null;
    }
    return null;
  }
}
