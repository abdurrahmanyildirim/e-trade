import { trigger, transition, style, query, group, animate, keyframes } from '@angular/animations';

export const stepper = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%'
      })
    ]),
    group([
      query(':enter', [
        animate(
          '500ms ease-in',
          keyframes([
            style({ transform: 'translateY(100%)', offset: 0 }),
            style({ transform: 'translateY(80%)', offset: 0.2 }),
            style({ transform: 'translateY(60%)', offset: 0.4 }),
            style({ transform: 'translateY(40%)', offset: 0.6 }),
            style({ transform: 'translateY(20%)', offset: 0.8 }),
            style({ transform: 'translateY(0%)', offset: 1 })
          ])
        )
      ]),
      query(':leave', [
        animate(
          '300ms ease-out',
          keyframes([
            style({ transform: 'translateX(0)', offset: 0 }),
            style({ transform: 'translateX(20%)', offset: 0.2 }),
            style({ transform: 'translateX(40%)', offset: 0.4 }),
            style({ transform: 'translateX(60%)', offset: 0.6 }),
            style({ transform: 'translateX(80%)', offset: 0.8 }),
            style({ opacity: 0, transform: 'translateX(100%)', offset: 1 })
          ])
        )
      ])
    ])
  ])
]);
