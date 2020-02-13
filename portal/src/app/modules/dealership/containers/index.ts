import { DealerManageComponent } from './dealer-manage/dealer-manage.component';
import { DealerItemComponent } from './dealer-item/dealer-item.component';
import { DealerGroupManageComponent } from './dealer-group-manage/dealer-group-manage.component';
import { DealerGroupItemComponent } from './dealer-group-item/dealer-group-item.component';

export * from './dealer-group-item/dealer-group-item.component';
export * from './dealer-group-manage/dealer-group-manage.component';
export * from './dealer-manage/dealer-manage.component';
export * from './dealer-item/dealer-item.component';

export const containers: any[] = [
  DealerGroupItemComponent,
  DealerGroupManageComponent,
  DealerManageComponent,
  DealerItemComponent
];
