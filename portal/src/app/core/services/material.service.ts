import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  constructor(private apiService: ApiService) {}

  uploadFiles(formData: FormData): Observable<any> {
    return this.apiService.post('resource', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getAllMaterials(): Observable<any> {
    return this.apiService.get('resource');
  }

  getMaterialAssignedUser(id): Observable<any> {
    return this.apiService.get(`resource/get-dealership-users/${id}`);
  }

  deleteMaterial(id: number) {
    return this.apiService.delete(`resource/${id}`);
  }

  updateMaterial(data: { id: number; type: string; value: boolean }) {
    return this.apiService.put(`resource/publish/${data.id}`, {
      type: data.type,
      value: data.value
    });
  }

  saveUser(data: { user_id: number[]; resource_id: number }) {
    return this.apiService.post(`resource/add-users`, data);
  }

  removeUser(data: { user_id: number[]; material_id: number }) {
    return this.apiService.post(`resource/delete-users`, data);
  }

  getAllUsersMaterials(type: string) {
    return this.apiService.get(`resource/get-learner-resources/${type}`);
  }

  addEmailContent(data: any, id: number) {
    return this.apiService.put(`resource/update-email-content/${id}`, data);
  }

  getMaterialByID(id) {
    return this.apiService.get(`resource/edit/${id}`);
  }

  sendEmail(id) {
    return this.apiService.post(`resource/send-email`, { id });
  }

  updateMaterialWithoutResource(data: { id: number; resource_name: string }) {
    return this.apiService.post(`resource/update/${data.id}`, {
      resource_name: data.resource_name
    });
  }
}
