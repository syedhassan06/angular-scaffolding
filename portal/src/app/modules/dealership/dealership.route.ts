import { Routes } from '@angular/router';

// containers
import * as fromContainers from './containers';

export const DEALERSHIP_ROUTE: Routes | any = [
  {
    path: 'manage',
    component: fromContainers.DealerManageComponent,
    data: { breadcrumb: 'List' }
  },
  { path: 'create', component: fromContainers.DealerItemComponent },
  { path: 'edit/:dealerID', component: fromContainers.DealerItemComponent },
  {
    path: 'group-manage',
    component: fromContainers.DealerGroupManageComponent
  },
  { path: 'group-create', component: fromContainers.DealerGroupItemComponent },
  {
    path: 'group-edit/:dealerGroupID',
    component: fromContainers.DealerGroupItemComponent
  }
];
