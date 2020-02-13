import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lms-lesson-content-modal',
  templateUrl: './lesson-content-modal.component.html',
  styleUrls: ['./lesson-content-modal.component.scss']
})
export class LessonContentModalComponent implements OnInit {
  selectedResource: {
    id: number;
    name: string;
    path: string;
    resource_url: string;
  };

  constructor(public modalRef: BsModalRef, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.selectedResource.resource_url = <any>(
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/secure-files/' + this.selectedResource.path
      )
    );
  }
}
