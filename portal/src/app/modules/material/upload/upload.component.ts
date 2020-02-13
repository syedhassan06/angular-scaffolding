import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from './../../../core/services/jwt.service';
import { ApiService } from './../../../core/services/api.service';
import { Subject } from 'rxjs';
import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { IHttpResponse, IAction } from '@portal/core/models';
import { NotificationService, MaterialService } from '@portal/core/services';
import { HttpEventType } from '@angular/common/http';
import { AppSetting } from '@portal/configs/app-setting.config';
import { takeUntil } from 'rxjs/operators';
import {
  UploadOutput,
  UploaderOptions,
  UploadInput,
  UploadFile,
  humanizeBytes
} from 'ngx-uploader';

@Component({
  selector: 'lms-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UploadComponent implements OnInit, OnDestroy {
  @ViewChild('materialFileControl') materialFileControl: any;
  materials: File[] = [];
  baseUrl = AppSetting.apiUrl;
  progressReport = 0;
  private readonly destroyed$ = new Subject<void>();
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  resourceName: string;
  selectedResource = null;
  page = {
    add: { title: 'Upload Materials' },
    edit: { title: 'Edit Material' }
  };
  action: IAction = 'add';

  constructor(
    private materialService: MaterialService,
    private apiService: ApiService,
    private jwtService: JwtService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notifyService: NotificationService
  ) {
    this.options = { concurrency: 0 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id) this.fetchResource(params.id);
    });
  }

  fetchResource(id) {
    this.materialService
      .getMaterialByID(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status && response.data) {
          //this.resource = {...this.resource,...response.data};
          this.selectedResource = response.data;
          this.action = 'edit';
          this.populate();
        }
      });
  }

  populate() {
    this.resourceName = this.selectedResource.resource_name;
  }

  doUpload(event: any) {
    //this.materialFileControl.upload();
    const files = event.files;
    if (files.length > 0) {
      const formData: FormData = new FormData();
      files.forEach((file: File, index: number) => {
        formData.append('file', file, file['name']);
      });

      this.materialService
        .uploadFiles(formData)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(
          ($event: any) => {
            if ($event.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round(
                (100 * $event.loaded) / $event.total
              );
              this.progressReport = percentDone;
              //console.log('percentDone', percentDone);
            } else if ($event.type === HttpEventType.Response) {
              const body: IHttpResponse = $event.body;
              this.notifyService.success(body.message, 'Success');
              this.clearAllMaterialFiles();
            }
          },
          (err: IHttpResponse) => {
            this.notifyService.error(
              (err && err.message) || 'Something went wrong'
            );
          }
        );
    }
  }

  onSave() {
    if (this.files.length > 0) {
      this.files.forEach(file => {
        this.doUploadFile(file);
      });
    } else {
      if (this.resourceName && this.selectedResource) {
        this.updateMaterial({
          id: this.selectedResource.id,
          resource_name: this.resourceName
        });
      }
    }
  }

  updateMaterial(data) {
    this.materialService.updateMaterialWithoutResource(data).subscribe(res => {
      this.shownNotification(res);
    });
  }

  shownNotification(res: IHttpResponse) {
    if (res && res.status) {
      this.notifyService.success(res.message, 'Success');
      this.router.navigateByUrl('/material/manage');
    }
  }

  onUploadSuccess() {
    //console.log('UPLOAD SUCCESSFULLKY');
  }

  showingProgress(event) {
    //console.log('PROGRESS');
  }

  onSelectFileUploader() {
    this.materials.push(...this.materialFileControl.files);
    //console.log("this.materials",this.materials);
    //this.materialFileControl.upload();
  }

  onRemoveFile(file: File) {
    const foundIndex = this.materials.findIndex((iterateFile: File) => {
      if (
        iterateFile['lastModified'] === file['lastModified'] &&
        iterateFile['name'] === file['name']
      ) {
        return true;
      }
    });
    if (foundIndex !== -1) {
      this.materials.splice(foundIndex, 1);
      this.notifyService.success(
        'File has been removed successfully',
        'Success'
      );
    }
  }

  clearAllMaterialFiles() {
    this.materialFileControl.clear();
    setTimeout(() => {
      this.materials = [];
      this.progressReport = 0;
    }, 700);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case 'allAddedToQueue':
        // uncomment this if you want to auto upload files when added
        // const event: UploadInput = {
        //   type: 'uploadAll',
        //   url: '/upload',
        //   method: 'POST',
        //   data: { foo: 'bar' }
        // };
        // this.uploadInput.emit(event);
        //this.doUploadFile(output.file);
        break;
      case 'addedToQueue':
        if (
          typeof output.file !== 'undefined' &&
          new RegExp('image/*').test(output.file.type)
        ) {
          this.notifyService.error('Please provided a valid file type.');
          return;
        }
        if (typeof output.file !== 'undefined') {
          //console.log('output.file.type');
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
        //console.log(this.files.length);
        this.removeFile(output.file.id);
        this.shownNotification(output.file.response);
        break;
    }
  }

  doUploadFile(file: UploadFile) {
    console.log("file",file);
    const event: UploadInput = {
      type: 'uploadFile',
      url: this.selectedResource
        ? `${this.apiService.apiUrl}resource/update/${this.selectedResource.id}`
        : `${this.apiService.apiUrl}resource`,
      file: file,
      fieldName: this.selectedResource ? 'file' : 'file[]',
      method: 'POST',
      data: { resource_name: this.resourceName },
      headers: {
        Authorization: this.jwtService.getToken()
      }
    };
    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
    //console.log('this.files', this.files);
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }
}
