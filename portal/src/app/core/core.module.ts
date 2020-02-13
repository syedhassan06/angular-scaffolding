import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

import { HttpTokenInterceptor } from './interceptors';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ToastrModule.forRoot(<any>{
      closeButton: true,
      preventDuplicates: true,
      timeOut: 2000,
      easeTime: 100,
      progressBar: true
      //maxOpened: 1,
      //autoDismiss: true
    }),
    NgProgressModule,
    NgProgressHttpModule,
    NgxWebstorageModule.forRoot()
  ],
  exports: [NgProgressModule, NgxWebstorageModule],
  declarations: [],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true }
  ]
})
export class CoreModule {}
