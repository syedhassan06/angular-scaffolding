import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastrService: ToastrService) {}

  success(message: string, title: string = '') {
    setTimeout(() => {
      this.toastrService.success(message, title);
    }, 5);
  }

  error(message: string, title: string = '') {
    setTimeout(() => {
      this.toastrService.error(message, title);
    }, 5);
  }

  info(message: string, title: string = '') {
    setTimeout(() => {
      this.toastrService.info(message, title);
    }, 5);
  }

  warning(message: string, title: string = '') {
    setTimeout(() => {
      this.toastrService.warning(message, title);
    }, 5);
  }
}
