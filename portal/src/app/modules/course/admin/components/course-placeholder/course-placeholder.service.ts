import { Subject } from 'rxjs';
import { ILoaderState } from '@portal/core/models/index';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoursePlaceholderService {
  private loaderSubject = new Subject<ILoaderState>();
  loaderState$ = this.loaderSubject.asObservable();
  constructor() {}

  show() {
    this.loaderSubject.next(<ILoaderState>{ show: true });
  }

  hide() {
    this.loaderSubject.next(<ILoaderState>{ show: false });
  }
}
