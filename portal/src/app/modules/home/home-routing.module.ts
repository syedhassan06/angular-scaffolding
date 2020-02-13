import { EmailNotificationsComponent } from './containers/email-notifications/email-notifications.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardSupervisorComponent } from './containers/dashboard-supervisor/dashboard-supervisor.component';

import { Shell } from '@portal/shell';
import { DashboardComponent } from './dashboard/dashboard.component';
import * as fromContainers from './containers';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'dashboard', component: DashboardComponent },
    { path: 'admin-dashboard', component: DashboardSupervisorComponent },
    { path: 'site-settings', component: fromContainers.SettingsComponent },
    {
      path: 'email-setting',
      component: '',
      children: [
        {
          path: 'create',
          component: fromContainers.EmailNotificationItemComponent
        },
        {
          path: 'edit/:id',
          component: fromContainers.EmailNotificationItemComponent
        },
        { path: '', component: fromContainers.EmailNotificationsComponent }
      ]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
