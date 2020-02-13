import { Component, OnInit } from '@angular/core';
import { IQuiz } from '@portal/core/models/lesson.model';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import {
  fadeInAnimation,
  slideInAnimation,
  shrinkAnimation
} from '@portal/shared/utils/animate';

@Component({
  selector: 'lms-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  animations: [fadeInAnimation, slideInAnimation, shrinkAnimation]
})
export class QuizComponent implements OnInit {
  transistion = { slide: 'right' };
  quizForm: FormGroup;
  questionList: IQuiz[] = [];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initQuizForm();
  }

  onAddQuestionForm() {
    const questionList = this.quizForm.get('question-list') as FormArray;
    questionList.push(this.initQuestionForm());
    if (questionList.controls.length > 0) {
      const totalLength = questionList.controls.length;
      const questionFormGroup: FormGroup = <FormGroup>(
        questionList.controls[totalLength - 1]
      );
      for (let i = 1; i <= 2; i++) {
        this.onAddOptionForm(questionFormGroup);
      }
    }
    //console.log(this.quizForm);
  }

  onRemoveQuestionForm(index: number) {
    this.transistion.slide = 'left';
    const questionList = this.quizForm.get('question-list') as FormArray;
    questionList.removeAt(index);
  }

  initQuizForm() {
    this.quizForm = this.formBuilder.group({
      'question-list': this.formBuilder.array([])
    });
  }

  initQuestionForm(): FormGroup {
    return this.formBuilder.group({
      question: [''],
      options: this.formBuilder.array([])
    });
  }

  initOptionForm(): FormGroup {
    return this.formBuilder.group({
      value: [''],
      status: [false]
    });
  }

  onAddOptionForm(questionForm: FormGroup): void {
    this.transistion.slide = 'right';
    const options = questionForm.get('options') as FormArray;
    options.push(this.initOptionForm());
  }

  onRemoveOptionForm(questionForm: FormGroup, index: number): void {
    const options = questionForm.get('options') as FormArray;
    options.removeAt(index);
  }
}
