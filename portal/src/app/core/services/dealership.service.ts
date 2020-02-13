import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { PrincipalService } from './principal.service';
import { IDealer, IHttpResponse, IDealerGroup } from '@portal/core/models';

@Injectable({
  providedIn: 'root'
})
export class DealershipService {
  constructor(
    private apiService: ApiService,
    private principalService: PrincipalService
  ) {}

  getAllGroups() {
    return this.apiService.get('dealergroup');
  }

  getAllDealers() {
    if (this.principalService.getLoggedInRole() === 'Manager') {
      return this.apiService.get('manager/get-dealerships');
    }
    return this.apiService.get('dealership');
  }

  getDealerByID(id: number) {
    return this.apiService.get(`dealership/edit/${id}`);
  }

  getDealerGroupByID(id: number) {
    return this.apiService.get(`dealergroup/edit/${id}`);
  }

  create(data: IDealer) {
    if (data.id) {
      return this.update(data);
    }
    return this.apiService.post(`dealership`, data);
  }

  createGroup(data: IDealerGroup) {
    if (data.id) {
      return this.updateGroup(data);
    }
    return this.apiService.post(`dealergroup`, data);
  }

  update(data: IDealer) {
    return this.apiService.put(`dealership/${data.id}`, data);
  }

  updateGroup(data: IDealer) {
    return this.apiService.put(`dealergroup/${data.id}`, data);
  }

  deleteDealer(id: number) {
    return this.apiService.delete(`dealership/${id}`);
  }

  deleteDealerGroup(id: number) {
    return this.apiService.delete(`dealergroup/${id}`);
  }

  getAvailableLearners(id: number) {
    if (this.principalService.getLoggedInRole() === 'Manager') {
      return this.apiService.get(`manager/get-users-of-managers/${id}`);
    }
    return this.apiService.get(`dealership/get/${id}/3`);
  }

  getAvailableManagers(id: number) {
    return this.apiService.get(`dealership/get/${id}/2`);
  }

  addLearner(data: { user_id: number[]; dealership_id: number }) {
    return this.apiService.post(`dealership/add-users`, data);
  }

  removeLearner(data: { user_id: number[]; dealership_id: number }) {
    return this.apiService.post(`dealership/delete-users`, data);
  }

  getDealerByDealerGroup(id: number) {
    return this.apiService.get(`dealergroup/${id}`);
  }

  getAssociateManagers(id: number) {
    return this.apiService.get(`dealership/get-managers/${id}`);
  }

  addManager(data: { user_id: number[]; dealership_id: number }) {
    return this.apiService.post(`dealership/add-managers`, data);
  }

  removeManager(data: { user_id: number[]; dealership_id: number }) {
    return this.apiService.post(`dealership/delete-managers`, data);
  }

  getAllDealershipCourses(dealershipID: number) {
    // if(this.principalService.hasManagerLoggedIn())
    //   return this.apiService.get(`manager/get-course-dealerships/${dealershipID}`);
    // else
    return this.apiService.get(`dealership/courses/${dealershipID}`);
  }

  addDealerOnCourse(data: { course_id: any[]; dealership_id: number }) {
    return this.apiService.post(`dealership/add-courses`, data);
  }

  removeDealerFromCourse(data: { course_id: any[]; dealership_id: number }) {
    return this.apiService.post(`dealership/delete-courses`, data);
  }

  getDealergroupManagers(dealergroupID) {
    return this.apiService.get(`dealergroup/get-dealerships/${dealergroupID}`);
  }

  updateDealergroupManager(data) {
    return this.apiService.post(`dealergroup/add-managers`, data);
  }

  getDealershipWithLearners() {
    return this.apiService.get(`report/get-dealership-with-users`);
  }

  getDealershipWithoutLearners() {
    return this.apiService.get(`report/get-users-without-dealership`);
  }

  getDealergroupWithDealerships() {
    return this.apiService.get(`report/get-dealergroups-with-dealerships`);
  }

  getManagersWithDealerships() {
    return this.apiService.get(`report/get-managers-of-dealerships`);
  }
}
