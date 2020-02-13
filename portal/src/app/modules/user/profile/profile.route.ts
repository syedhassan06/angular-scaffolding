import { EditProfileComponent } from './edit-profile.component';
import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';

export const PROFILE_ROUTE: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'edit', component: EditProfileComponent }
];
