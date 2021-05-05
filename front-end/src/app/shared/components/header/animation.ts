import { trigger, transition, style, animate, state } from '@angular/animations';

export const phoneSidebarOpenClose = trigger('sidebar', [
  state(
    'open',
    style({
      transform: 'translateX(0%)'
    })
  ),
  state(
    'closed',
    style({
      transform: 'translateX(-100%)'
    })
  ),
  transition('open => closed', [animate('0.35s ease-in')]),
  transition('closed => open', [animate('0.35s ease-out')])
]);
