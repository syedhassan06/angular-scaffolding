import { JwtService } from './../services/jwt.service';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { SessionStorageService } from 'ngx-webstorage';
import { IHttpResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private jwtService: JwtService,
    private $sessionStorage: SessionStorageService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (next.queryParams['guest'] && next.queryParams['email']) {
      const param = {
        email: next.queryParams['email'],
        key: next.queryParams['login_key']
      };
      return this.authService.loginAsGuest(param).pipe(
        take(1),
        map((res: IHttpResponse) => {
          if (res.status) {
            let isAdministrator = false;
            if (res.data.roles && Array.isArray(res.data.roles)) {
              isAdministrator = res.data.roles.find(role =>
                ['Admin', 'Manager'].includes(role)
              );
            }
            isAdministrator
              ? this.router.navigate(['admin-dashboard'])
              : this.router.navigate(['dashboard']);
            return false;
          } else {
            return true;
          }
        })
      );
    } else {
      return this.authService.isAuthenticated$.pipe(
        take(1),
        map((status: boolean) => {
          if (status && this.jwtService.getToken()) {
            this.router.navigateByUrl('dashboard');
            return false;
          } else {
            return true;
          }
        })
      );
    }
  }
}
