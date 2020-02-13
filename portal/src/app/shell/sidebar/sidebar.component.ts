import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService, SettingsService } from '@portal/core/services';
import { TermsConditionModalComponent } from '@portal/modules/home/components';
import { IHttpResponse } from './../../core/models/index';

@Component({
  selector: 'lms-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  user$ = this.authService.user$;
  userPermissions = ['Learner', 'Admin', 'Manager'];
  makeDisabled = false;

  constructor(
    private settings: SettingsService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private settingService: SettingsService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.populate().subscribe(
      (response: IHttpResponse) => {
        if (response && response.status) {
          this.authService.setAuth(response.data);
          if (
            response.data &&
            Array.isArray(response.data.roles) &&
            response.data.roles.length === 1 &&
            response.data.roles[0] === 'Learner' &&
            !response.data.terms_of_use_checked
          ) {
            this.makeDisabled = true;
            this.onOpenTermsModal();
          }
        } else {
          this.authService.purgeAuth();
        }
      },
      (err: IHttpResponse) => {
        this.authService.purgeAuth();
      }
    );
  }

  onOpenTermsModal() {
    this.settings.getTermsCondition().subscribe((response: any) => {
      if (response && response.status) {
        const initialState = {
          termsConditionDetail: response.data,
          disabled: this.makeDisabled
        };
        const config = {
          backdrop: true,
          class: 'modal-xl',
          ignoreBackdropClick: true
        };
        this.modalService.show(TermsConditionModalComponent, {
          initialState,
          ...config
        });
      }
    });
  }
}
