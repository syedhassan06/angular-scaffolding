import { SharedModule } from './../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonItemComponent } from './container/lesson-item/lesson-item.component';
import { LESSON_ROUTE } from './lesson.route';
import { QuizComponent } from './components/quiz/quiz.component';
import { ContentBlockPopupComponent } from './components/content-block-popup/content-block-popup.component';
import { LessonListComponent } from './components/lesson-list/lesson-list.component';
import { LessonsComponent } from './container/lessons/lessons.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(LESSON_ROUTE), SharedModule],
  declarations: [
    LessonItemComponent,
    QuizComponent,
    ContentBlockPopupComponent,
    LessonListComponent,
    LessonsComponent
  ],
  entryComponents: [QuizComponent]
})
export class LessonModule {}
