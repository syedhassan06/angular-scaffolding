import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { IUserForm, IHttpResponse, IUser } from '@portal/core/models';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { PrincipalService } from './principal.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user$: Observable<any>;
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private principalService: PrincipalService
  ) {}

  getProfile() {
    return this.apiService.get(`user/edit`);
  }

  updateProfile(data, id) {
    return this.apiService.post(`user/update/${id}`, data).pipe(
      map((response: IHttpResponse) => {
        if (response && response.status) {
          const userIdentity = this.principalService.getUserIdentity();
          response.data = { ...userIdentity, ...response.data };
          const user: IUser = <IUser>response.data;
          this.authService.setAuth(user, false);
        }
        this.principalService.identity(response);
        return response;
      })
    );
  }

  getDashboardSummary() {
    return this.apiService.get(`user/dashboard`);
  }

  createUser(data: IUserForm): Observable<any> {
    if (data.id) {
      return this.updateUser(data);
    }
    return this.apiService.post(`user`, data);
  }

  updateUser(data: IUserForm): Observable<any> {
    return this.apiService.post(`user/update/${data.id}`, data);
  }

  getAllUsers(): Observable<any> {
    if (this.principalService.hasManagerLoggedIn())
      return this.apiService.get(`manager/get-users`);
    else return this.apiService.get(`user`);
  }

  deleteUser(id: number) {
    return this.apiService.delete(`user/${id}`);
  }

  getUserByID(id: number) {
    return this.apiService.get(`user/edit/${id}`);
  }

  updateStatus(data: { id: number; is_active: boolean }): Observable<any> {
    return this.apiService.post(`user/change-status`, data);
  }

  sendCredentials(data: { id: number; email: string }): Observable<any> {
    return this.apiService.post(`user/resend-email`, data);
  }

  getAllUsersByRoleID(role_id): Observable<any> {
    return this.apiService.get(`report/get-users-with-role/${role_id}`);
  }
}
