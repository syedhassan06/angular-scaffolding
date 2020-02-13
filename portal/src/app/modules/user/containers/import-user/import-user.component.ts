import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import {
  JwtService,
  NotificationService,
  ApiService
} from '@portal/core/services';
import {
  UploadOutput,
  UploaderOptions,
  UploadInput,
  UploadFile,
  humanizeBytes
} from 'ngx-uploader';
import { Subject } from 'rxjs';

@Component({
  selector: 'lms-import-user',
  templateUrl: './import-user.component.html',
  styleUrls: ['./import-user.component.scss']
})
export class ImportUserComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  options: UploaderOptions = {
    concurrency: 0
    //allowedContentTypes: ['application/vnd.ms-excel']
  };
  files = [];
  uploadInput;
  humanizeBytes = humanizeBytes;
  dragOver = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private jwtService: JwtService,
    private notifyService: NotificationService
  ) {}

  ngOnInit() {
    this.uploadInput = new EventEmitter<UploadInput>();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case 'allAddedToQueue':
        this.doUploadFile(output.file);
        break;
      case 'addedToQueue':
        if (
          !(
            typeof output.file !== 'undefined' &&
            new RegExp('application/vnd.ms-excel.*').test(output.file.type)
          )
        ) {
          this.notifyService.error(
            'The format of the file you provided is not valid. Please use a CSV file only'
          );
          return;
        }
        if (typeof output.file !== 'undefined') {
          console.log(output.file.type);
          this.files.push(output.file);
        }
        break;
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          // update current data in files array for uploading file
          const index = this.files.findIndex(
            file =>
              typeof output.file !== 'undefined' && file.id === output.file.id
          );
          this.files[index] = output.file;
        }
        break;
      case 'removed':
        // remove file from array when removed
        this.files = this.files.filter(
          (file: UploadFile) => file !== output.file
        );
        break;
      case 'dragOver':
        this.dragOver = true;
        break;
      case 'dragOut':
      case 'drop':
        this.dragOver = false;
        break;
      case 'done':
        // The file is downloaded

        const response = output.file.response;
        if (response.status) {
          this.notifyService.success(response.message);
          this.removeAllFiles();
          this.router.navigateByUrl('/user/manage');
        } else {
          this.notifyService.error(response.message);
          this.removeAllFiles();
        }
        break;
    }
    //console.log(this.files);
  }

  doUploadFile(file: UploadFile) {
    const event: UploadInput = {
      type: 'uploadAll',
      url: `${this.apiService.apiUrl}user/import-users`,
      file: file,
      fieldName: 'file',
      method: 'POST',
      headers: {
        Authorization: this.jwtService.getToken()
      }
    };
    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
    this.removeFile(id);
    //this.removeAllFiles();
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }
}
