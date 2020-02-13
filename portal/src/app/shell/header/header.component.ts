import { Component, OnInit } from '@angular/core';
import { AuthService, PrincipalService } from './../../core/services';

@Component({
  selector: 'lms-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private principalService: PrincipalService
  ) {}

  ngOnInit() {}

  onLogout() {
    this.authService.logoutEmitter();
  }

  hasGuestLogin() {
    return this.principalService.hasGuestLogin();
  }
}
