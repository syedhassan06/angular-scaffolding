import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IUserForm } from '@portal/core/models';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  termsAgreement$: Observable<any>;
  haveTermsRead = false;
  constructor(private apiService: ApiService) {}

  updateSettings(data: IUserForm): Observable<any> {
    return this.apiService.put(`site-settings/${data.id}`, data);
  }

  getSettings(id: number = 1) {
    return this.apiService.get(`site-settings/edit/${id}`);
  }

  getTermsCondition() {
    this.termsAgreement$ = this.apiService.get(`site-settings/terms-of-use`);
    return this.termsAgreement$;
  }

  agreeTermsCondition() {
    return this.apiService.get(`site-settings/agree`);
  }
}
