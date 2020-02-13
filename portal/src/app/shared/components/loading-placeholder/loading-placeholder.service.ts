import { ILoaderState } from './../../../core/models/index';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingPlaceholderService {
  private loaderSubject = new BehaviorSubject<ILoaderState>({ show: false });
  loaderState$ = this.loaderSubject.asObservable();

  constructor() {}

  show() {
    this.loaderSubject.next(<ILoaderState>{ show: true });
  }

  hide() {
    this.loaderSubject.next(<ILoaderState>{ show: false });
  }
}
