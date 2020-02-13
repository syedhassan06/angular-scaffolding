import { Routes } from '@angular/router';
import { ReferenceLibraryComponent } from './reference-library/reference-library.component';
import { PROFILE_ROUTE } from './profile/profile.route';

// containers
import * as fromContainers from './containers';

export const USER_ROUTE: Routes = [
  {
    path: 'profile',
    children: PROFILE_ROUTE
  },
  {
    path: 'reference-library',
    component: ReferenceLibraryComponent,
    data: { type: 'reference_library' }
  },
  {
    path: 'active-material',
    component: ReferenceLibraryComponent,
    data: { type: 'material' }
  },
  { path: 'create', component: fromContainers.UserItemComponent },
  { path: 'edit/:id', component: fromContainers.UserItemComponent },
  { path: 'manage', component: fromContainers.UsersComponent },
  { path: 'import', component: fromContainers.ImportUserComponent }
];
