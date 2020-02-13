import { environment } from '../../environments/environment';
import { InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken('app-setting.config');

export const AppSetting = {
  title: 'ARMD LMS',
  apiUrl: environment.apiUrl,
  prefix: 'armd_',
  idleTimeout: 15,
  sessionTimeout: 30
};
