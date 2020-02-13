import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  constructor(private apiService: ApiService) {}

  createLesson(data) {
    if (data.id) {
      return this.updateLesson(data);
    }
    return this.apiService.post(`lesson`, data);
  }

  updateLesson(data) {
    return this.apiService.put(`lesson/${data.id}`, data);
  }

  getAllLessons() {
    return this.apiService.get(`lesson`);
  }

  getLesson(id: number) {
    return this.apiService.get(`lesson/edit/${id}`);
  }

  deleteLesson(id: number) {
    return this.apiService.delete(`lesson/${id}`);
  }
}
