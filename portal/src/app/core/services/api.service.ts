import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppSetting } from '@portal/configs/app-setting.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl = AppSetting.apiUrl;

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    return throwError(error.error);
  }

  private handleQueryParams(params: {} = {}): HttpParams {
    return new HttpParams({
      fromObject: params
    });
  }

  get(path: string, httpParams = {}): Observable<any> {
    return this.http
      .get(`${this.apiUrl}${path}`, {
        params: this.handleQueryParams(httpParams)
      })
      .pipe(catchError(this.handleError));
  }

  post(path: string, body = {}, options = {}): Observable<any> {
    return this.http
      .post(`${this.apiUrl}${path}`, body, options)
      .pipe(catchError(this.handleError));
  }

  put(path: string, body = {}, options = {}): Observable<any> {
    return this.http
      .put(`${this.apiUrl}${path}`, body, options)
      .pipe(catchError(this.handleError));
  }

  delete(path: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}${path}`)
      .pipe(catchError(this.handleError));
  }
}
