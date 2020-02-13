import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { getRoleList } from '@portal/shared/utils/helper';
import { PrincipalService } from '@portal/core/services/principal.service';
import { AuthService } from '@portal/core/services';
import { IHttpResponse } from '@portal/core/models';
import { finalize } from 'rxjs/operators';
import { slideInAnimation } from '@portal/shared/utils/animate';

@Component({
  selector: 'lms-account-switcher',
  templateUrl: './account-switcher.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./account-switcher.component.scss'],
  animations: [slideInAnimation]
})
export class AccountSwitcherComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  user$ = this.authService.user$;
  user = null;
  roles = getRoleList();
  selectedRole = null;
  isLoaderToggle = false;
  constructor(
    private principalService: PrincipalService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user$.subscribe(user => {
      this.user = user;
      if (user && Object.keys(user).length > 0) {
        this.fetchSelectedRoleByUser();
      }
    });
  }

  switchLogin() {
    this.isLoaderToggle = true;
    this.authService
      .switchLoggedInUser(this.selectedRole.value)
      .pipe(finalize(() => (this.isLoaderToggle = false)))
      .subscribe((res: IHttpResponse) => {
        if (res.status) {
          res.data = {
            ...this.principalService.getUserIdentity(),
            login_role: res.data.login_role
          };
          if (this.selectedRole.value === 'Learner') {
            this.router.navigateByUrl('dashboard');
          } else {
            this.router.navigateByUrl('admin-dashboard');
          }
          this.principalService.identity(res);
          //window.location.reload();
        }
      });
  }

  fetchSelectedRoleByUser() {
    if (
      this.user &&
      Array.isArray(this.user.roles) &&
      this.user.roles.length > 1
    ) {
      this.principalService.setFirstAvailableRole();
    }
    const role = this.principalService.getLoggedInRole();
    this.selectedRole =
      this.user && this.roles.find(item => item.value === role);
    this.roles = this.roles.filter((iteratedRole: any) =>
      this.user.roles.find((item: string) => item === iteratedRole.value)
    );
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
