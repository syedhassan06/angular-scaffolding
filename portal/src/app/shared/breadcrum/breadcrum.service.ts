import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumService {
  _breadcrumEmitter: Subject<any> = new BehaviorSubject<any>(false);
  breadcrumSubscriber$: Observable<any> = this._breadcrumEmitter.asObservable();

  notifyResolvedValues(val) {
    this._breadcrumEmitter.next(val);
  }
}
