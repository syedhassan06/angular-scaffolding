import { PrincipalService } from './../services/principal.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRouteAccessGuard implements CanActivate {
  constructor(
    private principalService: PrincipalService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const authorities = next.data['roles'];
    if (!authorities || authorities.length === 0) {
      return true;
    }
    return this.checkAuthority(authorities, state.url);
  }

  checkAuthority(authorities: string[], url: string): Promise<boolean> {
    const principal = this.principalService;
    return Promise.resolve(
      principal.hasAccess(authorities).then(response => {
        if (response) {
          return true;
        }
        if (authorities.includes('Admin')) {
          this.router.navigate(['dashboard']);
        } else if (authorities.includes('Learner')) {
          this.router.navigate(['admin-dashboard']);
        }
        //this.stateStorageService.storeUrl(url);
        return false;
      })
    );
  }
}
