import { LessonsComponent } from './container/lessons/lessons.component';
import { Routes } from '@angular/router';
import { LessonItemComponent } from './container/lesson-item/lesson-item.component';

export const LESSON_ROUTE: Routes = [
  {
    path: 'create',
    component: LessonItemComponent
  },
  {
    path: 'edit/:id',
    component: LessonItemComponent
  },
  {
    path: 'manage',
    component: LessonsComponent
  }
];
