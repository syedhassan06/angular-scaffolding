import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { UploadComponent } from './upload/upload.component';
import { MATERIAL_ROUTE } from './material.route';
import { SharedModule } from '@portal/shared/shared.module';
import { MaterialListComponent } from './material-list/material-list.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MaterialEmailModalComponent } from './material-email-modal/material-email-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    RouterModule.forChild(MATERIAL_ROUTE),
    SharedModule,
    NgxSpinnerModule
  ],
  entryComponents: [MaterialEmailModalComponent],
  declarations: [
    UploadComponent,
    MaterialListComponent,
    MaterialEmailModalComponent
  ]
})
export class MaterialModule {}
