import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '@portal/shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardSupervisorComponent } from './containers/dashboard-supervisor/dashboard-supervisor.component';

import * as fromContainers from './containers';
import * as fromComponents from './components';
import { NgxChartsModule } from '@swimlane/ngx-charts';

const COMPONENTS = [...fromComponents.components, ...fromContainers.containers];

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    NgxSpinnerModule,
    NgxChartsModule
  ],
  declarations: [
    DashboardComponent,
    DashboardSupervisorComponent,
    ...COMPONENTS
  ]
})
export class HomeModule {}
