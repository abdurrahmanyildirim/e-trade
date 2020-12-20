import { trigger, state, style, transition, animate, group } from '@angular/animations';

export const SlideInOutAnimation = [
  trigger('slideInOut', [
    state(
      'in',
      style({
        display: 'block',
        opacity: 1
      })
    ),
    state(
      'out',
      style({
        display: 'none',
        opacity: 0
      })
    ),
    transition('in => out', [animate('400ms ease-out')]),
    transition('out => in', [animate('400ms ease-in')])
  ])
];
