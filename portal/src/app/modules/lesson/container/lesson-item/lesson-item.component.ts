import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  HostBinding,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import { QuizComponent, ContentBlockPopupComponent } from './../../components';
import {
  NotificationService,
  LessonService,
  MaterialService
} from '@portal/core/services';
import { takeUntil } from 'rxjs/operators';
import { IHttpResponse, IResource, ILesson } from '@portal/core/models';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'lms-lesson-item',
  templateUrl: './lesson-item.component.html',
  styleUrls: ['./lesson-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: []
})
export class LessonItemComponent implements OnInit, OnDestroy {
  @ViewChild('quizContainer', { read: ViewContainerRef }) quizContainer;
  @ViewChild('documentContainer', { read: ViewContainerRef }) documentContainer;
  @ViewChild('mediaContainer', { read: ViewContainerRef }) mediaContainer;
  @ViewChild(ContentBlockPopupComponent) contentBlockPopupComponent;
  lessonForm: FormGroup;
  private readonly destroyed$ = new Subject<void>();
  lesson: ILesson = null;
  action: 'add' | 'edit' = 'add';
  page = {
    add: { title: 'Create Lesson' },
    edit: { title: 'Edit Lesson' }
  };

  resources: IResource[] = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private formBuilder: FormBuilder,
    private notifyService: NotificationService,
    private lessonService: LessonService,
    private router: Router,
    private materialService: MaterialService
  ) {
    this.buildForm();
    this.fetchAllMaterials();
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      if (routeParams.id) {
        this.action = 'edit';
        this.fetchLesson(routeParams.id);
      }
    });
  }

  onOpenContentModal() {
    this.contentBlockPopupComponent.show();
  }

  onAddBlockContent(contentID: number) {
    //console.log("contentID",contentID);
    this.contentBlockPopupComponent.hide();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      QuizComponent
    );
    const component = this.quizContainer.createComponent(componentFactory);
  }

  buildForm() {
    this.lessonForm = this.formBuilder.group({
      id: [0],
      title: ['', [Validators.required]],
      resource_id: [null, [Validators.required]]
    });
  }

  onSave() {
    if (this.lessonForm.valid) {
      const formData = {
        id: this.lessonForm.get('id').value,
        title: this.lessonForm.get('title').value,
        resource_id: [this.lessonForm.get('resource_id').value.id]
      };
      if (!formData.id) delete formData['id'];
      //console.log('formData',formData);
      //return;
      this.lessonService
        .createLesson(formData)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(
          (response: IHttpResponse) => {
            if (response.status) {
              this.notifyService.success(response.message, 'Success');
              this.router.navigateByUrl('lesson/manage');
            } else {
              this.notifyService.error(response.message, 'Error');
            }
          },
          (err: IHttpResponse) => {
            this.notifyService.error(
              (err && err.message) || 'Something went wrong',
              'Error'
            );
          }
        );
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  fetchAllMaterials(): void {
    this.materialService
      .getAllMaterials()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        this.resources = response.status
          ? [{ name: 'Select' }, ...response.data]
          : [];
        this.populateMaterial();
      });
  }

  fetchLesson(id: number) {
    this.lessonService
      .getLesson(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          this.lesson = response.data;

          this.lessonForm.patchValue(this.lesson);
          this.populateMaterial();
          if (this.lesson) {
            this.lessonForm.get('resource_id').setValue({
              name: this.lesson.title,
              id: this.lesson.resource_id
            });
          }
        }
      });
  }

  populateMaterial() {
    if (this.lesson) {
      const filteredesource = this.resources.filter(
        (resource: IResource) => resource.id === this.lesson.resource_id
      );
      if (Array.isArray(filteredesource) && filteredesource.length > 0) {
        setTimeout(() => {
          this.lessonForm.get('resource_id').setValue(filteredesource[0]);
        }, 600);
      }
    }
  }
}
