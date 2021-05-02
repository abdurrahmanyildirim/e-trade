import { trigger, transition, style, query, group, animate, keyframes } from '@angular/animations';

export const stepper = trigger('routeAnimations', [
  transition('* <=> *', [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          left: 0,
          width: '100%'
        })
      ],
      { optional: true }
    ),
    group([
      query(
        ':enter',
        [
          animate(
            '500ms ease-in',
            keyframes([
              style({ opacity: 0, transform: 'translateY(-100%)', offset: 0 }),
              style({ opacity: 0.2, transform: 'translateY(-80%)', offset: 0.2 }),
              style({ opacity: 0.4, transform: 'translateY(-60%)', offset: 0.4 }),
              style({ opacity: 0.6, transform: 'translateY(-40%)', offset: 0.6 }),
              style({ opacity: 0.8, transform: 'translateY(-20%)', offset: 0.8 }),
              style({ opacity: 1, transform: 'translateY(0%)', offset: 1 })
            ])
          )
        ],
        { optional: true }
      ),
      query(
        ':leave',
        [
          animate(
            '300ms ease-out',
            keyframes([
              style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
              style({ opacity: 0.8, transform: 'translateX(20%)', offset: 0.2 }),
              style({ opacity: 0.6, transform: 'translateX(40%)', offset: 0.4 }),
              style({ opacity: 0.4, transform: 'translateX(60%)', offset: 0.6 }),
              style({ opacity: 0.2, transform: 'translateX(80%)', offset: 0.8 }),
              style({ opacity: 0, transform: 'translateX(100%)', offset: 1 })
            ])
          )
        ],
        { optional: true }
      )
    ])
  ])
]);
