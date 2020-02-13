import { ResetPasswordComponent } from './modules/auth/reset-password/reset-password.component';
import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
  PreloadAllModules,
  Route
} from '@angular/router';

import { LoginComponent } from './modules/auth/login/login.component';
import { GuestGuard } from './core/guards';

export const CATCH_ALL_ROUTE: Route = {
  path: '**',
  redirectTo: 'login'
};

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [GuestGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  CATCH_ALL_ROUTE
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // preload all modules; optionally we could
      // implement a custom preloading strategy for just some
      // of the modules (PRs welcome 😉)
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
