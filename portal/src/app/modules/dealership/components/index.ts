import { DealershipPopupComponent } from './dealership-popup/dealership-popup.component';
import { DealerListComponent } from './dealer-list/dealer-list.component';
import { DealerGroupFormComponent } from './dealer-group-form/dealer-group-form.component';
import { DealerFormComponent } from './dealer-form/dealer-form.component';
import { AssociateManagerComponent } from './associate-manager/associate-manager.component';
import { AssociateLearnerComponent } from './associate-learner/associate-learner.component';
import { DealerGroupListComponent } from './dealer-group-list/dealer-group-list.component';
import { DealergroupModalComponent } from './dealergroup-modal/dealergroup-modal.component';
import { DealerCourseAssignedModalComponent } from './dealer-course-assigned-modal/dealer-course-assigned-modal.component';
import { DealergroupManagerModalComponent } from './dealergroup-manager-modal/dealergroup-manager-modal.component';

export * from './dealer-form/dealer-form.component';
export * from './dealer-group-form/dealer-group-form.component';
export * from './dealer-list/dealer-list.component';
export * from './dealership-popup/dealership-popup.component';
export * from './associate-manager/associate-manager.component';
export * from './associate-learner/associate-learner.component';
export * from './dealer-group-list/dealer-group-list.component';
export * from './dealergroup-modal/dealergroup-modal.component';
export * from './dealer-course-assigned-modal/dealer-course-assigned-modal.component';
export * from './dealergroup-manager-modal/dealergroup-manager-modal.component';

export const components: any[] = [
  DealerFormComponent,
  DealerGroupFormComponent,
  DealerListComponent,
  DealerGroupListComponent,
  DealershipPopupComponent,
  AssociateManagerComponent,
  AssociateLearnerComponent,
  DealergroupModalComponent,
  DealerCourseAssignedModalComponent
];

export const entryComponents: any[] = [DealergroupManagerModalComponent];
