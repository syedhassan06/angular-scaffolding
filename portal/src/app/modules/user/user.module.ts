import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { USER_ROUTE } from './user.route';
import { ReferenceLibraryComponent } from './reference-library/reference-library.component';
import { EditProfileComponent } from './profile/edit-profile.component';
import { SharedModule } from '@portal/shared/shared.module';
import {
  UserItemComponent,
  UsersComponent,
  ImportUserComponent
} from './containers';
import { UserListComponent, UserFormComponent } from './components';

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild(USER_ROUTE)],
  declarations: [
    ProfileComponent,
    ReferenceLibraryComponent,
    EditProfileComponent,
    UserFormComponent,
    UserItemComponent,
    UsersComponent,
    UserListComponent,
    ImportUserComponent
  ]
})
export class UserModule {}
