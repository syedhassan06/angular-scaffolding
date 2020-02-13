import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class EmailNotificationService {
  constructor(private apiService: ApiService) {}

  addSetting(data: any): Observable<any> {
    if (data.id) {
      return this.updateSetting(data);
    }
    return this.apiService.post(`email`, data);
  }

  updateSetting(data: any): Observable<any> {
    return this.apiService.put(`email/${data.id}`, data);
  }

  getAllSettings(): Observable<any> {
    return this.apiService.get(`email`);
  }

  deleteSetting(id: number) {
    return this.apiService.delete(`email/${id}`);
  }

  getSettingByID(id: number) {
    return this.apiService.get(`email/edit/${id}`);
  }
}
