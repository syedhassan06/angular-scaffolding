import { Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { MaterialListComponent } from './material-list/material-list.component';
import { UserRouteAccessGuard } from './../../core/guards/user-route-access.guard';

export const MATERIAL_ROUTE: Routes = [
  { path: 'upload', component: UploadComponent },
  { path: 'edit/:id', component: UploadComponent },
  {
    path: 'manage',
    component: MaterialListComponent
    /*canActivate: [UserRouteAccessGuard],
    data: {
      roles: ['ADMIN']
    } */
  }
];
