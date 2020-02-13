import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { AppSetting } from '@portal/configs/app-setting.config';
import { SessionStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  public jwtToken = AppSetting.prefix + 'jwtToken';

  constructor(
    private cookieService: CookieService,
    private $sessionStorage: SessionStorageService
  ) {}

  getToken(): string {
    const tokenValue =
      this.$sessionStorage.retrieve(this.jwtToken) ||
      this.cookieService.get(this.jwtToken);
    return (tokenValue && tokenValue) || null;
  }

  saveToken(token: string, remember = false, IsGuest = false) {
    if (IsGuest) {
      this.$sessionStorage.store(this.jwtToken, token);
    } else {
      this.cookieService.set(this.jwtToken, token);
    }
  }

  destroyToken() {
    if (this.$sessionStorage.retrieve(this.jwtToken)) {
      this.$sessionStorage.clear(this.jwtToken);
    } else {
      this.cookieService.delete(this.jwtToken);
    }
  }
}
