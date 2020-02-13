import { map } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  public saveScheduleEmitter = new Subject<boolean>();
  public saveSchedule$ = this.saveScheduleEmitter.asObservable();

  constructor(private apiService: ApiService) {}

  getAllCourses() {
    return this.apiService.get(`report/all-courses-report`);
  }

  getAllCourseRegistration() {
    return this.apiService.get(`report/course-registration`);
  }

  getAllCourseProgress() {
    return this.apiService.get(`report/course-progress`);
  }

  getAllDealerships() {
    return this.apiService.get(`report/all-dealerships`);
  }

  getUserCourse(id: number) {
    return this.apiService.get(`report/user-courses/${id}`);
  }

  getAllCourseCompletion() {
    return this.apiService.get(`report/course-completion`);
  }

  getAllCourseCertificate() {
    return this.apiService.get(`report/course-certificate`);
  }

  getUserLoginHistory() {
    return this.apiService.get(`report/user-no-of-logins`);
  }

  getUserLoginHistoryByID(id: number) {
    return this.apiService.get(`report/user-login/${id}`);
  }

  getUserRegistrationHistory() {
    return this.apiService.get(`report/user-registration`);
  }

  getActivityLog() {
    return this.apiService.get(`report/activity-log`);
  }

  getAllUserCourses() {
    return this.apiService.get(`report/user-courses`);
  }

  getLessonProgressByCourse(id: number) {
    return this.apiService.get(`report/lesson-progress/${id}`);
  }

  getReportCard(data) {
    return this.apiService.get(`report/dealership-report-card`, data);
  }

  saveSchedule(data) {
    let httpReq = this.apiService.post(`report/add-schedule`, data);
    if (data.id) {
      httpReq = this.apiService.put(`report/update-schedule/${data.id}`, data);
    }
    return httpReq.pipe(
      map(res => {
        if (res.status) {
          this.saveScheduleEmitter.next(true);
        }
        return res;
      })
    );
  }

  getAllManagers() {
    return this.apiService.get(`manager/get`);
  }

  getScheduleReport() {
    return this.apiService.get(`report/get-schedules`);
  }

  deleteSchedule(id) {
    return this.apiService.delete(`report/delete-schedule/${id}`);
  }

  getSchedule(id) {
    return this.apiService.get(`report/edit-schedule/${id}`);
  }

  completeMarkedOnCourse(data: { course_id: number; user_course_id: number }) {
    return this.apiService.post(`user-course/mark-complete-by-admin`, data);
  }
}
