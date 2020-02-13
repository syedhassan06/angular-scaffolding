import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ICourseItem, ICourseForm } from './../models/course.model';
import { IHttpResponse } from '@portal/core/models';
import { PrincipalService } from './principal.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courseItemSubject = new BehaviorSubject<ICourseItem>(
    {} as ICourseItem
  );
  public courseItem$: any = <any>(
    this.courseItemSubject.asObservable().pipe(distinctUntilChanged())
  );

  public coursePageType = 'other';

  constructor(
    private apiService: ApiService,
    private principalService: PrincipalService
  ) {}

  create(data: ICourseForm) {
    if (data.course.id) {
      return this.update(data);
    }
    return this.apiService.post(`course`, data.formData);
  }

  update(data: ICourseForm) {
    return this.apiService.post(`course/update`, data.formData);
  }

  getCourses() {
    return this.apiService.get('course');
  }

  getCourseByID(id: number, cached = false) {
    return this.apiService.get(`course/edit/${id}`).pipe(
      map((res: IHttpResponse) => {
        this.courseItemSubject.next(res.data);
        return res;
      })
    );
  }

  deleteCourse(id: number) {
    return this.apiService.delete(`course/${id}`);
  }

  addLessonOnCourse(data: { lesson_id: number; lesson_type: string }) {
    return this.apiService.post(`course/add-lesson`, data);
  }

  deleteLessonOnCourse(course_lesson_id: number) {
    return this.apiService.delete(`course/delete-lesson/${course_lesson_id}`);
  }

  addUserOnCourse(data: { user_id: number[]; course_id: number }) {
    return this.apiService.post(`course/add-users`, data);
  }

  removeUserOnCourse(data: { user_id: number[]; course_id: number }) {
    return this.apiService.post(`course/delete-users`, data);
  }

  getCourseLessons(id: number) {
    return this.apiService.get(`course/get-available-lessons/${id}`);
  }

  getAllLearnerCourses() {
    return this.apiService.get('user-course');
  }

  getAllLearnerLessonsByCourse(courseID: number): Observable<IHttpResponse> {
    return this.apiService.get(`user-course/${courseID}`);
  }

  getAllAvailableUsers(courseID: number) {
    if (this.principalService.hasManagerLoggedIn())
      return this.apiService.get(`manager/get-course-dealerships/${courseID}`);
    else return this.apiService.get(`course/get-available-users/${courseID}`);
  }

  launchedCourse(courseID: number) {
    return this.apiService.get(`user-course/launch/${courseID}`);
  }

  courseAccomplishment(data: { user_course_id: number }) {
    return this.apiService.post(`user-course/mark-complete`, data);
  }

  getReport() {
    return this.apiService.get(`report`);
  }

  getCourseByDealershipID(id = []) {
    return this.apiService.get(`dealership/get-courses/${id.join(',')}`);
  }

  courseActivityLog(lessonCourseID: number) {
    return this.apiService.get(`user-course/exit/${lessonCourseID}`);
  }

  saveAssignmentToCourse(data: any) {
    if (data.id) {
      return this.apiService.post(`course/update-assignment/${data.id}`, data);
    } else {
      return this.apiService.post(`course/add-assignment`, data);
    }
  }

  deleteAssignmentFromCourse(assignmentID: any) {
    return this.apiService.delete(`course/assignment/${assignmentID}`);
  }

  fetchAllAssignments(courseID: number): Observable<any> {
    return this.apiService.get(`course/get-assignment/${courseID}`);
  }

  fetchAssignment(courseID: number, assignmentID: number) {
    return this.apiService.get(
      `course/get-assignment/${courseID}/${assignmentID}`
    );
  }

  learnerAssignmentSubmission(data) {
    return this.apiService.post(`user-course/submit-assignment`, data);
  }

  fetchSubmittedAssignment(courseID) {
    return this.apiService.get(`course/submitted-assignments/${courseID}`);
  }

  assignmentGrading(data) {
    return this.apiService.post(`course/grade-assignment`, data);
  }
}
