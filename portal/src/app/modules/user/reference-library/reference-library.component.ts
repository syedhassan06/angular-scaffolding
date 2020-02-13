import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IHttpResponse } from '@portal/core/models';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MaterialService } from '@portal/core/services';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lms-reference-library',
  templateUrl: './reference-library.component.html',
  styleUrls: ['./reference-library.component.scss']
})
export class ReferenceLibraryComponent implements OnInit, OnDestroy {
  @ViewChild('modalTemplate') modalTemplate;
  modalRef: BsModalRef;
  private readonly destroyed$ = new Subject<void>();
  materials = [];
  tableFilters = ['resource_name'];
  type: string;
  selectedResource: any;
  resourceCategory = {
    reference_library: { title: 'Reference Library' },
    material: { title: 'Active Material' }
  };
  columns = [
    {
      field: 'resource_name',
      header: 'Material',
      //filterType: 'input',
      //filter: true,
      filterMatchMode: 'contains',
      sortable: true
    },
    {
      header: 'Action'
    }
  ];
  constructor(
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private materialService: MaterialService,
    private loadingPlaceholderService: LoadingPlaceholderService
  ) {
    this.loadingPlaceholderService.show();
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(params => {
      this.type = params.type;
      this.fetchAll();
    });
    this.modalService.onHidden.subscribe(result => {
      this.selectedResource = null;
    });
  }

  fetchAll(): void {
    this.loadingPlaceholderService.show();
    this.materialService
      .getAllUsersMaterials(this.type)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.loadingPlaceholderService.hide())
      )
      .subscribe((response: IHttpResponse) => {
        this.materials = response.status ? response.data : [];
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onClickModal(resource: any) {
    this.selectedResource = resource;
    this.selectedResource.resource_path_other = <any>(
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/secure-files/' + this.selectedResource.resource_path
      )
    );
    this.modalRef = this.modalService.show(this.modalTemplate, {
      class: 'modal-xl'
    });
  }
}
