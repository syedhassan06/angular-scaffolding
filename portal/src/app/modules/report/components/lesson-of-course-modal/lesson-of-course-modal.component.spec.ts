import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonOfCourseModalComponent } from './lesson-of-course-modal.component';

describe('LessonOfCourseModalComponent', () => {
  let component: LessonOfCourseModalComponent;
  let fixture: ComponentFixture<LessonOfCourseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LessonOfCourseModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonOfCourseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
