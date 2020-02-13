import { JwtService } from './../services/jwt.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { AuthService, NotificationService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private jwtService: JwtService,
    private notifyService: NotificationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map((status: boolean) => {
        if (status) {
          return true;
        } else {
          this.router.navigate(['login']);
          if (this.jwtService.getToken()) {
            this.notifyService.error(
              'You are unable to access the requested page. Please login',
              'Unauthorized'
            );
          }
          return false;
        }
      })
    );
  }
}
