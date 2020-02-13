import { DealerPackageComponent } from './containers/dealer-package/dealer-package.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@portal/shared/shared.module';
import { DEALERSHIP_ROUTE } from './dealership.route';
import { NgxSpinnerModule } from 'ngx-spinner';

// containers
import * as fromContainers from './containers';
// components
import * as fromComponents from './components';
import { DealergroupModalComponent } from './components/dealergroup-modal/dealergroup-modal.component';
import { DealerCourseAssignedModalComponent } from './components/dealer-course-assigned-modal/dealer-course-assigned-modal.component';

const COMPONENTS = [
  ...fromContainers.containers,
  ...fromComponents.components,
  ...fromComponents.entryComponents
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxSpinnerModule,
    RouterModule.forChild(DEALERSHIP_ROUTE)
  ],
  declarations: [...COMPONENTS, DealerPackageComponent],
  entryComponents: [
    DealergroupModalComponent,
    DealerCourseAssignedModalComponent,
    ...fromComponents.entryComponents
  ]
})
export class DealershipModule {}
