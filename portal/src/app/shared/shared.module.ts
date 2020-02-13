import { ColumnFilterComponent } from './../modules/report/components/column-filter/column-filter.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxErrorsModule } from '@hackages/ngxerrors';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ModalModule, AccordionModule, ProgressbarModule } from 'ngx-bootstrap';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap';
import { FileSizePipe, KeysPipe } from './pipes';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import {
  ValidationBorderDirective,
  AccessPermissionDirective
} from './directives';
import { PageNotFoundComponent } from './errors/page-not-found/page-not-found.component';
import { ContentLoaderModule } from '@netbasal/ngx-content-loader';
import { LoadingPlaceholderComponent } from './components/loading-placeholder/loading-placeholder.component';
import { PickListModule } from 'primeng/picklist';
import { TooltipModule } from 'primeng/tooltip';
import { NgxUploaderModule } from 'ngx-uploader';
import { TreeModule } from 'primeng/tree';
import { MomentModule } from 'ngx-moment';
import { EditorModule } from 'primeng/editor';
import { ChipsModule } from 'primeng/chips';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ImgProfileDirective } from './directives/img-profile.directive';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressbarComponent } from './components/progressbar/progressbar.component';
import { ExportPdfReportComponent } from './components/export-pdf-report/export-pdf-report.component';
import { StatusComponent } from './components/status/status.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { CheckboxModule } from 'primeng/checkbox';
import { BreadcrumComponent } from './breadcrum/breadcrum.component';
const PIPES = [FileSizePipe, KeysPipe];

const MODULES = [
  TableModule,
  DropdownModule,
  HttpClientModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  PickListModule,
  NgxUploaderModule,
  TooltipModule,
  TreeModule,
  EditorModule,
  ChipsModule,
  InputSwitchModule,
  CalendarModule,
  InputTextModule,
  MultiSelectModule,
  MomentModule,
  KeyFilterModule,
  CheckboxModule
];

const COMPONENTS = [
  ConfirmDialogComponent,
  LoadingPlaceholderComponent,
  ProgressbarComponent,
  ExportPdfReportComponent,
  StatusComponent,
  BreadcrumComponent
];

const DIRECTIVES = [
  ValidationBorderDirective,
  AccessPermissionDirective,
  ImgProfileDirective
];

@NgModule({
  imports: [
    CommonModule,
    NgxErrorsModule,
    ...MODULES,
    ModalModule.forRoot(),
    ContentLoaderModule,
    AccordionModule.forRoot(),
    ProgressbarModule.forRoot(),
    TabsModule.forRoot()
  ],
  exports: [
    NgxErrorsModule,
    ...PIPES,
    ...MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ModalModule,
    ProgressbarModule,
    AccordionModule,
    ContentLoaderModule,
    ColumnFilterComponent,
    TabsModule
  ],
  declarations: [
    ...PIPES,
    ...COMPONENTS,
    ...DIRECTIVES,
    PageNotFoundComponent,
    ColumnFilterComponent,
    ProgressbarComponent,
    ExportPdfReportComponent
  ],
  entryComponents: [],
  providers: [BsModalService, BsModalRef]
})
export class SharedModule {}
