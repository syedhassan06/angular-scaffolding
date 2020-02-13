import { AppSetting } from './../../configs/app-setting.config';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject, of } from 'rxjs';
import { map, distinctUntilChanged, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { PrincipalService } from './principal.service';
import { ILogin, IHttpResponse, IUser } from './../models';
import { HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userSubject = new BehaviorSubject<IUser>({} as IUser);
  public user$ = this.userSubject.asObservable().pipe(distinctUntilChanged());

  private userLogoutEmitter = new Subject<boolean>();
  public userLogout$ = this.userLogoutEmitter
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
    private principalService: PrincipalService,
    private $localStorage: LocalStorageService
  ) {}

  login(data: ILogin): Observable<IHttpResponse> {
    return this.apiService.post('login', data).pipe(
      map((response: IHttpResponse) => {
        this.principalService.identity(response);
        if (response && response.status) {
          const user: IUser = <IUser>response.data;
          this.setAuth(user, true);
          //this.$localStorage.store(AppSetting.prefix + 'sess',Date.now());
        }
        return response;
      })
    );
  }

  populate(): Observable<IHttpResponse> {
    // If JWT detected, attempt to get & store user's info
    //console.log("token",this.jwtService.getToken());
    if (this.jwtService.getToken()) {
      return this.apiService.get('user/get').pipe(
        map((res: IHttpResponse) => {
          if (this.principalService.hasGuestLogin()) {
            res.data['guest'] = res.data && true;
          }
          this.principalService.identity(res);
          return res;
        })
      );
    } else {
      // Remove any potential remnants of previous auth states
      return of(null);
    }
  }

  logout() {
    return this.apiService.get('user/logout').pipe(
      map((response: IHttpResponse) => {
        this.purgeAuth();
        return response;
      })
    );
  }

  getUserSession() {
    return this.$localStorage.retrieve(AppSetting.prefix + 'sess');
  }

  logoutEmitter() {
    this.userLogoutEmitter.next(true);
  }

  public setAuth(user: IUser, haveNewToken = false, guestLogin = false): void {
    if (haveNewToken)
      this.jwtService.saveToken(user.api_key, false, guestLogin);
    this.userSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  public purgeAuth(): void {
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.userSubject.next({} as IUser);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
    this.principalService.authenticate(null);
    this.principalService.setLoggedInRole(null);
  }

  sendPasswordEmail(email: string) {
    return this.apiService.post('forget-password', { email });
  }

  updatePassword(data: any) {
    return this.apiService.put('reset-password', data);
  }

  loginAsGuest(data: {
    email: string;
    key: string;
  }): Observable<IHttpResponse> {
    return this.apiService
      .post(
        'user/login',
        {
          email: data.email
        },
        {
          headers: new HttpHeaders({
            Authorization: data.key
          })
        }
      )
      .pipe(
        map((response: IHttpResponse) => {
          if (response && response.status) {
            response.data['guest'] = response.data && true;
            const user: IUser = <IUser>response.data;
            this.setAuth(user, true, true);
          }
          this.principalService.identity(response);
          return response;
        })
      );
  }

  switchLoggedInUser(role: string): Observable<IHttpResponse> {
    const user = this.principalService.getUserIdentity();
    const data = { id: user.user_id, login_role: role };
    return this.apiService.post('user/update-login-role', data).pipe(
      map((res: IHttpResponse) => {
        if (res.status) {
          this.principalService.setLoggedInRole(role);
        }
        return res;
      })
    );
  }
}
