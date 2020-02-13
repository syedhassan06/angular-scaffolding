import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { IModalSetting } from '@portal/core/models';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  settings: IModalSetting = {
    title: 'Confirmation',
    content: 'Are you sure you want to delete',
    cancelButtonText: 'No',
    confirmButtonText: 'Yes'
  };
  confirmCallback: Function;
  cancelCallback: Function;
  _confirmEmitter: Subject<any> = new BehaviorSubject<any>(false);
  confirmSubscriber: Observable<any> = this._confirmEmitter.asObservable();

  confirm(settings: IModalSetting, ConfirmCallback: any, CancelCallback: any) {
    this.settings = { ...this.settings, ...settings };
    this.confirmCallback = ConfirmCallback;
    this.cancelCallback = CancelCallback;
    this._confirmEmitter.next(true);
  }
}
