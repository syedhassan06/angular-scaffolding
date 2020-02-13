import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'lms-learner.container',
  templateUrl: './learner.container.component.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [animate(500, style({ opacity: 0 }))])
    ])
  ]
})
export class LearnerContainerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
