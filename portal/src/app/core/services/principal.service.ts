import { AppSetting } from './../../configs/app-setting.config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IHttpResponse } from '@portal/core/models';
import { IUser } from './../models/user.model';
import { JwtService } from './jwt.service';
import { SessionStorageService, LocalStorageService } from 'ngx-webstorage';
@Injectable({
  providedIn: 'root'
})
export class PrincipalService {
  private authenticated = false;
  private userIdentity: IUser;
  private authenticationState = new Subject<any>();
  private roleSessName = '';

  constructor(
    private $sessionStorage: SessionStorageService,
    private $localStorage: LocalStorageService,
    private jwtService: JwtService
  ) {}

  authenticate(identity): void {
    this.userIdentity = identity;
    this.authenticated = identity !== null;
    this.authenticationState.next(this.userIdentity);
  }

  getUserIdentity(): IUser {
    return this.userIdentity;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  hasAccess(roles: string[]): Promise<boolean> {
    return Promise.resolve(this.hasAccessDirect(roles));
  }

  hasAccessDirect(roles: string[]): boolean {
    for (let i = 0; i < roles.length; i++) {
      if (this.userIdentity && Array.isArray(this.userIdentity.roles)) {
        const loggedInRole = this.getLoggedInRole();
        if (loggedInRole) {
          if (loggedInRole === roles[i]) {
            return true;
          }
        } else if (this.userIdentity.roles.indexOf(roles[i]) !== -1) {
          return true;
        }
      }
    }
    return false;
  }

  hasGuestLogin() {
    return this.$sessionStorage.retrieve(this.jwtService.jwtToken);
  }

  hasManagerLoggedIn() {
    return this.userIdentity.login_role == 'Manager';
  }

  getAuthenticationState(): Observable<any> {
    return this.authenticationState.asObservable();
  }

  identity(res: IHttpResponse): void {
    if (res.status) {
      const loggedInRole = res.data.login_role;
      if (!loggedInRole) {
        if (Array.isArray(res.data.roles) && res.data.roles.length === 1) {
          res.data.login_role = res.data.roles[0];
        }
      }
      this.userIdentity = res.data;
      this.authenticated = true;
      this.authenticationState.next(this.userIdentity);
    } else {
      this.userIdentity = null;
      this.authenticated = false;
      this.authenticationState.next(this.userIdentity);
    }
  }

  getLoggedInRole() {
    if (this.userIdentity && this.hasGuestLogin()) {
      return this.userIdentity.login_role;
    }
    return this.$localStorage.retrieve(this.roleSessName);
  }

  setLoggedInRole(role: string) {
    if (role) {
      this.roleSessName = AppSetting.prefix + this.userIdentity.id + '_role';
      this.$localStorage.store(this.roleSessName, role);
      this.userIdentity.login_role = role;
    } else {
      this.$localStorage.clear(this.roleSessName);
    }
  }

  setFirstAvailableRole() {
    if (this.getLoggedInRole()) {
      return false;
    }
    if (this.userIdentity && this.userIdentity.login_role) {
      this.setLoggedInRole(this.userIdentity.login_role);
      return false;
    } else {
      this.setLoggedInRole(this.userIdentity.roles[0]);
      return true;
    }
  }
}
