import { Injectable } from '@angular/core';
import {
  animate,
  style,
  transition,
  trigger,
  AnimationTriggerMetadata,
  state,
  group
} from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class UtilsHelperService {
  static fadeInOut(): AnimationTriggerMetadata {
    return;
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [animate(500, style({ opacity: 0 }))])
    ]);
  }
}

export const fadeInAnimation = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(500, style({ opacity: 1 }))
  ]),
  transition(':leave', [animate(500, style({ opacity: 0 }))])
]);
export const slideInAnimation = trigger('slide', [
  state(
    'in',
    style({
      transform: 'translate3d(0%, 0, 0)'
    })
  ),
  state(
    'out',
    style({
      transform: 'translate3d(100%, 0, 0)'
    })
  ),
  transition('in => out', animate('400ms ease-in-out')),
  transition('out => in', animate('400ms ease-in-out'))
]);
export const shrinkAnimation = trigger('slideInOut', [
  state('in', style({ height: '*', opacity: 0 })),
  transition(':leave', [
    style({ height: '*', opacity: 1 }),

    group([
      animate(300, style({ height: 0 })),
      animate('200ms ease-in-out', style({ opacity: '0' }))
    ])
  ]),
  transition(':enter', [
    style({ height: '0', opacity: 0 }),

    group([
      animate(300, style({ height: '*' })),
      animate('400ms ease-in-out', style({ opacity: '1' }))
    ])
  ])
]);

export const slideUpDown = trigger('slideUpDown', [
  state('in', style({ height: '*', opacity: 0 })),
  transition(':leave', [
    style({ height: '*', opacity: 1 }),

    group([
      animate(300, style({ height: 0 })),
      animate('200ms ease-in-out', style({ opacity: '0' }))
    ])
  ]),
  transition(':enter', [
    style({ height: '0', opacity: 0 }),

    group([
      animate(300, style({ height: '*' })),
      animate('400ms ease-in-out', style({ opacity: '1' }))
    ])
  ])
]);
