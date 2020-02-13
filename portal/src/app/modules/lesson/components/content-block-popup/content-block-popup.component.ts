import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ContentType, LessonContentType } from './../../model';

@Component({
  selector: 'lms-content-block-popup',
  templateUrl: './content-block-popup.component.html',
  styleUrls: ['./content-block-popup.component.scss']
})
export class ContentBlockPopupComponent implements OnInit {
  @ViewChild('lessonContentModalTemplate') lessonContentModalTemplate;
  @Output() addContentBlock = new EventEmitter<number>();
  lessonContentModalRef: BsModalRef;
  contentType: LessonContentType = ContentType;
  selectedContentType = 3;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-sm'
  };

  constructor(private modalService: BsModalService) {}

  ngOnInit() {}

  show() {
    this.lessonContentModalRef = this.modalService.show(
      this.lessonContentModalTemplate,
      this.config
    );
  }

  hide() {
    this.lessonContentModalRef.hide();
  }

  get contentTypeOptions(): string[] {
    let options: string[] = [];
    const contentTypeKeys = Object.keys(this.contentType);
    if (contentTypeKeys.length > 0) {
      options = contentTypeKeys.slice(contentTypeKeys.length / 2);
    }
    return options;
  }

  onSave() {
    this.addContentBlock.emit(this.selectedContentType);
  }
}
