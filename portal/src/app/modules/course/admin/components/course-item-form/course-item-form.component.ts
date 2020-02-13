import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ICourseItem, ICourseForm } from '@portal/core/models';

@Component({
  selector: 'lms-course-item-form',
  templateUrl: './course-item-form.component.html',
  styleUrls: ['./course-item-form.component.scss']
})
export class CourseItemFormComponent implements OnInit {
  courseForm: FormGroup;
  _course: ICourseItem;
  courseImgURL = null;
  @ViewChild('courseImginputFile') courseImginputFile: ElementRef;
  @Input() action: string | 'edit' | 'add';
  @Input()
  set course(data: ICourseItem) {
    if (data) {
      this._course = data;
      this.courseForm.patchValue(data);
    }
  }
  get course() {
    return this._course;
  }
  @Output() save$ = new EventEmitter<ICourseForm>();

  constructor(private formBuilder: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() {}

  buildForm() {
    this.courseForm = this.formBuilder.group({
      id: [0, []],
      title: ['', [Validators.required]],
      isActive: ['1', [Validators.required]],
      dayLimit: ['', []],
      description: ['', []],
      isEsignature: ['0', []],
      canExpire: [0, []],
      expiryPeriodCount: ['1', []],
      expiryPeriodType: ['week', []],
      course_image: [null]
    });
  }

  onSave() {
    if (this.courseForm.valid) {
      const data = { ...this.courseForm.value };
      const formData = new FormData();
      if (!data.id) delete data.id;
      Object.keys(data).forEach(keyIndex => {
        formData.append(keyIndex, data[keyIndex]);
      });
      //console.log("data",data);
      this.save$.emit({ formData: formData, course: data });
    }
  }

  onToggleExpiryPeriod() {
    const val = this.courseForm.get('canExpire').value;
  }

  get days() {
    const arr = [];
    for (let i = 1; i <= 30; i++) {
      arr.push(i);
    }
    return arr;
  }

  get calendar() {
    return [
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
      { label: 'Year', value: 'year' }
    ];
  }

  onPreviewCourseImage(files) {
    if (files.length === 0) return;

    // const mimeType = files[0].type;
    // if (mimeType.match(/image\/*/) == null) {
    //   this.message = "Only images are supported.";
    //   return;
    // }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
      this.courseImgURL = reader.result;
    };
    this.courseForm.get('course_image').setValue(files[0]);
  }

  onRemoveCourseImg() {
    (this.courseImginputFile.nativeElement as HTMLInputElement).value = '';
    this.courseImgURL = '';
    this.courseForm.get('course_image').setValue(null);
  }
}
